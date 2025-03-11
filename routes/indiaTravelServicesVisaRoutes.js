import dotenv from 'dotenv';
dotenv.config();
const indiaTravelServicesVisaRouter = express.Router();
import express from 'express';
import { uploadFiles } from '../middleware/multerMiddleware.js';
import visaRequestFormController from '../controllers/visa.js';

import visaRequestFormController2 from '../controllers/visaStep2Controller.js';
import visaRequestFormController3 from '../controllers/visaStep3Controller.js';
import visaRequestFormController4 from '../controllers/visaStep4Controller.js';
import visaRequestFormController5 from '../controllers/visaStep5Controller.js';
import visaRequestFormController6 from '../controllers/visaStep6Controller.js';
import getAllStepDataController from '../controllers/getAllStepData.js';
import visaRequestFormController8 from '../controllers/visaStep8Controller.js';
import { sendEmailBasedOnDomain } from '../utils/sendEmailBasedOnDomain.js';

const mailMiddlewareBasedOnDomain = (req, res, next) => {
  req.mailAuth = sendEmailBasedOnDomain(
    process.env.INDIA_TRAVEL_SERVICES_DOMAIN_URL
  );
  next();
};

indiaTravelServicesVisaRouter.use(mailMiddlewareBasedOnDomain);

// step 1
indiaTravelServicesVisaRouter
  .route('/add/step-one')
  .post(visaRequestFormController.createVisaRequestForm);

indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm')
  .get(visaRequestFormController.viewAllVisaRequestForm);

indiaTravelServicesVisaRouter
  .route('/viewVisaRequestFormSendPendingEmail')
  .post(visaRequestFormController.sendPendingMailVisaRequestForm);

indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm/:id')
  .get(visaRequestFormController.viewVisaRequestFormById)
  .put(visaRequestFormController.updateVisaRequestForm)
  .patch(visaRequestFormController.updateVisaRequestFormPatch)
  .delete(visaRequestFormController.deleteVisaRequestForm);

indiaTravelServicesVisaRouter
  .route('/viewVisaRequestFormLastExitStepUrl/:id')
  .put(visaRequestFormController.updateVisaRequestFormLastExitStepUrl);
indiaTravelServicesVisaRouter
  .route('/viewVisaRequestFormPayment/:id')
  .put(visaRequestFormController.updateVisaRequestFormPayment);

indiaTravelServicesVisaRouter
  .route('/paymentStatus/:id')
  .put(visaRequestFormController.updateVisaRequestFormPaymentStatus);

// step 2
indiaTravelServicesVisaRouter
  .route('/add/step-two')
  .post(visaRequestFormController2.createStep2);
indiaTravelServicesVisaRouter
  .route('/viewAllVisaRequestForm2')
  .get(visaRequestFormController2.viewAllVisaRequestForm2);
indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm2/:id')
  .get(visaRequestFormController2.viewVisaRequestForm2ById)
  .put(visaRequestFormController2.updateVisaRequestForm2);
indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm2ByFormId/:id')
  .get(visaRequestFormController2.viewVisaRequestForm2ByFormId);
// step 3
indiaTravelServicesVisaRouter
  .route('/add/step-three')
  .post(visaRequestFormController3.createStep3);
indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm3/:id')
  .get(visaRequestFormController3.viewAllVisaRequestForm3)
  .put(visaRequestFormController3.updateVisaRequestForm3);

// step 4
indiaTravelServicesVisaRouter
  .route('/add/step-four')
  .post(visaRequestFormController4.createStep4);
indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm4/:id')
  .put(visaRequestFormController4.updateVisaRequestForm4);
// step 5
indiaTravelServicesVisaRouter
  .route('/add/step-five')
  .post(visaRequestFormController5.createStep5);
indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm5/:id')
  .put(visaRequestFormController5.updateVisaRequestForm5);

// step 6
indiaTravelServicesVisaRouter.route('/add/step-six').post(
  uploadFiles([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'passport', maxCount: 15 },
    { name: 'businessCard', maxCount: 15 },
    { name: 'eMedicalCard', maxCount: 15 },
  ]),
  visaRequestFormController6.createStep6
);

// step 8
indiaTravelServicesVisaRouter
  .route('/add/step-eight')
  .post(visaRequestFormController8.createStep8);
indiaTravelServicesVisaRouter
  .route('/viewVisaRequestForm8ByFormId/:id')
  .get(visaRequestFormController8.viewVisaRequestForm8ByFormId);

// step all list data in once
indiaTravelServicesVisaRouter
  .route('/getAllStepData/:id')
  .get(getAllStepDataController.getAllStepData);

// login evisa user
indiaTravelServicesVisaRouter
  .route('/loginEvisaUser')
  .post(visaRequestFormController.loginEvisaUser);

export default indiaTravelServicesVisaRouter;
