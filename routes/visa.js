import dotenv from 'dotenv';
dotenv.config();
const visaRouter = express.Router();
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
  const domain = process.env.VISA_COLLECT_DOMAIN_URL;
  req.domainUrl = domain;
  req.mailAuth = sendEmailBasedOnDomain(domain);
  next();
};

visaRouter.use(mailMiddlewareBasedOnDomain);

// step 1
visaRouter
  .route('/add/step-one')
  .post(visaRequestFormController.createVisaRequestForm);

visaRouter
  .route('/viewVisaRequestForm')
  .get(visaRequestFormController.viewAllVisaRequestForm);

visaRouter
  .route('/viewVisaRequestFormSendPendingEmail')
  .post(visaRequestFormController.sendPendingMailVisaRequestForm);

visaRouter
  .route('/viewVisaRequestForm/:id')
  .get(visaRequestFormController.viewVisaRequestFormById)
  .put(visaRequestFormController.updateVisaRequestForm)
  .patch(visaRequestFormController.updateVisaRequestFormPatch)
  .delete(visaRequestFormController.deleteVisaRequestForm);

visaRouter
  .route('/viewVisaRequestFormLastExitStepUrl/:id')
  .put(visaRequestFormController.updateVisaRequestFormLastExitStepUrl);
visaRouter
  .route('/viewVisaRequestFormPayment/:id')
  .put(visaRequestFormController.updateVisaRequestFormPayment);

visaRouter
  .route('/paymentStatus/:id')
  .put(visaRequestFormController.updateVisaRequestFormPaymentStatus);

// step 2
visaRouter.route('/add/step-two').post(visaRequestFormController2.createStep2);
visaRouter
  .route('/viewAllVisaRequestForm2')
  .get(visaRequestFormController2.viewAllVisaRequestForm2);
visaRouter
  .route('/viewVisaRequestForm2/:id')
  .get(visaRequestFormController2.viewVisaRequestForm2ById)
  .put(visaRequestFormController2.updateVisaRequestForm2);
visaRouter
  .route('/viewVisaRequestForm2ByFormId/:id')
  .get(visaRequestFormController2.viewVisaRequestForm2ByFormId);
// step 3
visaRouter
  .route('/add/step-three')
  .post(visaRequestFormController3.createStep3);
visaRouter
  .route('/viewVisaRequestForm3/:id')
  .get(visaRequestFormController3.viewAllVisaRequestForm3)
  .put(visaRequestFormController3.updateVisaRequestForm3);

// step 4
visaRouter.route('/add/step-four').post(visaRequestFormController4.createStep4);
visaRouter
  .route('/viewVisaRequestForm4/:id')
  .put(visaRequestFormController4.updateVisaRequestForm4);
// step 5
visaRouter.route('/add/step-five').post(visaRequestFormController5.createStep5);
visaRouter
  .route('/viewVisaRequestForm5/:id')
  .put(visaRequestFormController5.updateVisaRequestForm5);

// step 6
visaRouter.route('/add/step-six').post(
  uploadFiles([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'passport', maxCount: 15 },
    { name: 'businessCard', maxCount: 15 },
    { name: 'eMedicalCard', maxCount: 15 },
  ]),
  visaRequestFormController6.createStep6
);

// step 8
visaRouter
  .route('/add/step-eight')
  .post(visaRequestFormController8.createStep8);
visaRouter
  .route('/viewVisaRequestForm8ByFormId/:id')
  .get(visaRequestFormController8.viewVisaRequestForm8ByFormId);

// step all list data in once
visaRouter
  .route('/getAllStepData/:id')
  .get(getAllStepDataController.getAllStepData);

// login evisa user
visaRouter
  .route('/loginEvisaUser')
  .post(visaRequestFormController.loginEvisaUser);

export default visaRouter;
