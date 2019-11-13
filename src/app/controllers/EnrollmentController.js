import * as Yup from 'yup';
import { startOfHour, addMonths, parseISO, isBefore } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, plan_id, student_id } = req.body;

    /**
     * Check Student exists
     */
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'The Student was not found' });
    }

    /**
     * Check Plan exists
     */
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'The plan was not found.' });
    }

    /**
     * Check for past date
     */
    const startDate = startOfHour(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    const { price, duration } = plan;
    const priceTotal = price * duration;
    const endDate = addMonths(startDate, duration);

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date: endDate,
      price: priceTotal,
    });

    return res.send(enrollment);
  }
}

export default new EnrollmentController();
