import express from 'express';
import kenyaDeclarationController from '../../controllers/kenya/kenyaDeclarationController.js';

const kenyaDeclarationRouter = express.Router();

kenyaDeclarationRouter.post(
    '/',
    kenyaDeclarationController.createKenyaDeclaration
);

kenyaDeclarationRouter.get(
    '/:formId',
    kenyaDeclarationController.getKenyaDeclarationByFormId
);

kenyaDeclarationRouter.put(
    '/:formId',
    kenyaDeclarationController.updateKenyaDeclaration
);

export default kenyaDeclarationRouter;