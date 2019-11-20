import * as Yup from 'yup';

import Help_Orders from '../models/Help_orders';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

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

    const idAnswer = await Help_Orders.findByPk(req.params.id);

    if (!idAnswer) {
      return res.status(401).json({ error: 'ID no exists' });
    }

    const student = await Student.findOne({
      where: { id: idAnswer.student_id },
      attributes: ['id', 'name', 'email'],
    });

    const {
      id,
      student_id,
      question,
      answer,
      answer_at,
    } = await idAnswer.update(req.body);

    await Queue.add(AnswerMail.key, {
      idAnswer,
      student,
    });

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
