import * as Yup from 'yup';
import Sequelize from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { Op } = Sequelize;
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student no exists' });
    }

    const checkin = await Checkin.findAll({
      where: {
        student_id,
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 7000),
        },
      },
    });

    if (checkin.length >= 5) {
      return res.status(401).json({
        error: 'The user can only do 5 checkins within 7 calendar days.',
      });
    }

    await Checkin.create({ student_id });

    return res.json({
      message: `Welcome ${student.name}, you still have ${checkin.length} access for 7 days`,
    });
  }

  async index(req, res) {
    const { student_id } = req.params;

    const checkin = await Checkin.findAll({
      where: { student_id },
    });

    return res.json({ message: `7-day access counter: ${checkin.length}` });
  }
}

export default new CheckinController();
