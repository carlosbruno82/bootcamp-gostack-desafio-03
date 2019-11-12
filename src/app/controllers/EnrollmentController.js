import * as Yup from 'yup';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, plan_id } = req.body;

    if (plan_id === 1) {
}

    return res.send();
  }
}

export default new EnrollmentController();
