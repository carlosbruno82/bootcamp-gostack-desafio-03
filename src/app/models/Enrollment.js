import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // static associate(models) {
  //   this.belongsTo(models.Student, { foreignkey: 'student_id', as: 'student' });
  //   this.belongsTo(models.Plan, { foreignkey: 'plan_id', as: 'plan' });
  // }
}

export default Enrollment;
