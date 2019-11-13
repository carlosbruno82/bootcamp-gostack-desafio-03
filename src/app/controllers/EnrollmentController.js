import * as Yup from 'yup';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, plan_id } = req.body;

    const plan = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!plan) {
      return res.status(401).json({ error: 'The plan was not found.' });
    }

    // const { student_id } = await Enrollment.create(req.body);

    return res.json(plan.title);
  }
}

export default new EnrollmentController();
