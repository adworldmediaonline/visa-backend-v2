import express from 'express';
import egyptDeclarationController from '../../controllers/egyptN/egyptDeclarationController.js';

const egyptDeclarationRouter = express.Router();

egyptDeclarationRouter.post(
    '/',
    egyptDeclarationController.createEgyptDeclaration
);

egyptDeclarationRouter.get(
    '/:formId',
    egyptDeclarationController.getEgyptDeclarationByFormId
);

egyptDeclarationRouter.put(
    '/:formId',
    egyptDeclarationController.updateEgyptDeclaration
);

export default egyptDeclarationRouter;
