import * as Yup from 'yup';
import { startOfHour, addMonths, parseISO, isBefore } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration'],
        },
      ],
    });

    return res.json(enrollment);
  }

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
     * Check if the student exists at enrollment
     */
    const studentEnrollment = await Enrollment.findOne({
      where: { student_id },
    });

    if (studentEnrollment) {
      return res
        .status(401)
        .json({ error: 'Student already has an enrollment' });
    }

    /**
     * Check Student exists
     */
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student no exists' });
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

    await Queue.add(EnrollmentMail.key, {
      enrollment,
      student,
      plan,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      plan_id: Yup.number(),
      student_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, plan_id, student_id } = req.body;

    /**
     * Check if the student exists at enrollment
     */
    const studentEnrollment = await Enrollment.findOne({
      where: { student_id },
    });

    if (!studentEnrollment) {
      return res
        .status(401)
        .json({ error: 'The student does not have enrollment' });
    }

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
     * Check for past date
     */
    const startDate = startOfHour(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    const { price, duration } = plan;
    const priceTotal = price * duration;
    const endDate = addMonths(startDate, duration);

    const enrollment = await studentEnrollment.update({
      student_id,
      plan_id,
      start_date,
      end_date: endDate,
      price: priceTotal,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const { student_id } = req.body;
    const studentEnrollment = await Enrollment.findOne({
      where: { student_id },
    });

    if (!studentEnrollment) {
      return res
        .status(401)
        .json({ error: 'The student does not have enrollment' });
    }

    Enrollment.destroy({
      where: { student_id },
    });

    return res.json(studentEnrollment);
  }
}

export default new EnrollmentController();
