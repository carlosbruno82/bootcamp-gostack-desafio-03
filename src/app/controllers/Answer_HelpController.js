import * as Yup from 'yup';
// import { parseISO, startOfHour, isBefore } from 'date-fns';

import Help_Orders from '../models/Help_orders';

class Answer_HelpController {
  async index(req, res) {
    const noRes = await Help_Orders.findAll({
      where: { answer: null },
      attributes: ['id', 'student_id', 'question'],
    });
    return res.json(noRes);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
      answer_at: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const idExists = await Help_Orders.findByPk(req.params.id);

    if (!idExists) {
      return res.status(401).json({ error: 'ID no exists' });
    }

    const {
      id,
      student_id,
      question,
      answer,
      answer_at,
    } = await idExists.update(req.body);

    return res.json({
      id,
      student_id,
      question,
      answer,
      answer_at,
    });
  }
}

export default new Answer_HelpController();
