import express from 'express';
import * as cutOptionsController from '../controllers/cutOptionsController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
// router.use(authController.protect);

// Route for handling materials
router.route('/')
    .post(cutOptionsController.createCutOption)
    .get(cutOptionsController.getAllCutOptions);

// Route for updating a material
router.route('/:id')
    .patch(cutOptionsController.updateCutOption);


// Route for rendering the list of uploaded files

export default router;
