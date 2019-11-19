import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import Help_OrdersController from './app/controllers/Help_OrdersController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/session', SessionController.store);

routes.post('/checkin/:student_id/checkins', CheckinController.store);
routes.get('/checkin/:student_id/checkins', CheckinController.index);

routes.post('/students/:student_id/help-orders', Help_OrdersController.store);

routes.use(authMiddleware);

routes.post('/student', StudentController.store);
routes.put('/student/:id', StudentController.update);

routes.post('/plan', PlanController.store);
routes.get('/plan/', PlanController.index);
routes.put('/plan/:id', PlanController.update);
routes.delete('/plan/:id', PlanController.delete);

routes.post('/enrollment', EnrollmentController.store);
routes.get('/enrollment', EnrollmentController.index);
routes.put('/enrollment', EnrollmentController.update);
routes.delete('/enrollment', EnrollmentController.delete);

export default routes;
