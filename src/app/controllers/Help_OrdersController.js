import * as Yup from 'yup';

import Help_Orders from '../models/Help_orders';
import Student from '../models/Student';

class Help_OrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;

    const { question } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student no exists' });
    }

    await Help_Orders.create({ student_id, question });

    return res.json({
      student_id,
      question,
    });
  }

  async index(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student no exists' });
    }

    const help_orders = await Help_Orders.findAll({
      where: { student_id },
      attributes: ['id', 'question'],
    });

    return res.json(help_orders);
  }
}

export default new Help_OrdersController();
