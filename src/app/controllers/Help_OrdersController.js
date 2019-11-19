import * as Yup from 'yup';

import Help_Orders from '../models/Help_orders';
import Student from '../models/Student';

class Help_OrdersController {
  async store(req, res) {
    // const schema = Yup.object().shape({
    //   student_id: Yup.string().required(),
    // });

    // if (!(await schema.isValid(req.params))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }

    const schemaBody = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;

    const { question } = req.body;

    const student = await Student.findByPk(student_id);

    return res.json({ message: `${student.name} | ${question}` });
  }
}

export default new Help_OrdersController();
