import * as Yup from 'yup';

import Help_Orders from '../models/Help_orders';
import Student from '../models/Student';

class Answer_HelpController {
  async index(req, res) {
    const noRes = await Help_Orders.findAll({
      where: { answer: null },
      attributes: ['id', 'student_id', 'question'],
    });
    return res.json(noRes);
  }

  async store(req, res) {
    return res.json();
  }
}

export default new Answer_HelpController();
