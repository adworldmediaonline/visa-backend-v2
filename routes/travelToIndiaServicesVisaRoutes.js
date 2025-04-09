import dotenv from 'dotenv';
dotenv.config();
const travelToIndiaServicesVisaRouter = express.Router();
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
  const domain = process.env.TRAVEL_TO_INDIA_SERVICES_DOMAIN_URL;
  req.domainUrl = domain;
  req.mailAuth = sendEmailBasedOnDomain(domain);
  next();
};

travelToIndiaServicesVisaRouter.use(mailMiddlewareBasedOnDomain);

// step 1
travelToIndiaServicesVisaRouter
  .route('/add/step-one')
  .post(visaRequestFormController.createVisaRequestForm);

travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm')
  .get(visaRequestFormController.viewAllVisaRequestForm);

travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestFormSendPendingEmail')
  .post(visaRequestFormController.sendPendingMailVisaRequestForm);

travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm/:id')
  .get(visaRequestFormController.viewVisaRequestFormById)
  .put(visaRequestFormController.updateVisaRequestForm)
  .patch(visaRequestFormController.updateVisaRequestFormPatch)
  .delete(visaRequestFormController.deleteVisaRequestForm);

travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestFormLastExitStepUrl/:id')
  .put(visaRequestFormController.updateVisaRequestFormLastExitStepUrl);
travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestFormPayment/:id')
  .put(visaRequestFormController.updateVisaRequestFormPayment);

travelToIndiaServicesVisaRouter
  .route('/paymentStatus/:id')
  .put(visaRequestFormController.updateVisaRequestFormPaymentStatus);

// step 2
travelToIndiaServicesVisaRouter
  .route('/add/step-two')
  .post(visaRequestFormController2.createStep2);
travelToIndiaServicesVisaRouter
  .route('/viewAllVisaRequestForm2')
  .get(visaRequestFormController2.viewAllVisaRequestForm2);
travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm2/:id')
  .get(visaRequestFormController2.viewVisaRequestForm2ById)
  .put(visaRequestFormController2.updateVisaRequestForm2);
travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm2ByFormId/:id')
  .get(visaRequestFormController2.viewVisaRequestForm2ByFormId);
// step 3
travelToIndiaServicesVisaRouter
  .route('/add/step-three')
  .post(visaRequestFormController3.createStep3);
travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm3/:id')
  .get(visaRequestFormController3.viewAllVisaRequestForm3)
  .put(visaRequestFormController3.updateVisaRequestForm3);

// step 4
travelToIndiaServicesVisaRouter
  .route('/add/step-four')
  .post(visaRequestFormController4.createStep4);
travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm4/:id')
  .put(visaRequestFormController4.updateVisaRequestForm4);
// step 5
travelToIndiaServicesVisaRouter
  .route('/add/step-five')
  .post(visaRequestFormController5.createStep5);
travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm5/:id')
  .put(visaRequestFormController5.updateVisaRequestForm5);

// step 6
travelToIndiaServicesVisaRouter.route('/add/step-six').post(
  uploadFiles([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'passport', maxCount: 15 },
    { name: 'businessCard', maxCount: 15 },
    { name: 'eMedicalCard', maxCount: 15 },
  ]),
  visaRequestFormController6.createStep6
);

// step 8
travelToIndiaServicesVisaRouter
  .route('/add/step-eight')
  .post(visaRequestFormController8.createStep8);
travelToIndiaServicesVisaRouter
  .route('/viewVisaRequestForm8ByFormId/:id')
  .get(visaRequestFormController8.viewVisaRequestForm8ByFormId);

// step all list data in once
travelToIndiaServicesVisaRouter
  .route('/getAllStepData/:id')
  .get(getAllStepDataController.getAllStepData);

// login evisa user
travelToIndiaServicesVisaRouter
  .route('/loginEvisaUser')
  .post(visaRequestFormController.loginEvisaUser);

export default travelToIndiaServicesVisaRouter;
