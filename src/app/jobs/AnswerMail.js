import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, idAnswer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua Pergunta foi respondida',
      template: 'answer',
      context: {
        date: format(
          parseISO(idAnswer.answer_at),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        student: student.name,
        question: idAnswer.question,
        answer: idAnswer.answer,
      },
    });
  }
}

export default new AnswerMail();
