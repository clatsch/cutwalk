import express from 'express';
import * as materialController from '../controllers/materialController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

// Route for handling materials
router.route('/')
    .post(materialController.createMaterial)
    .get(materialController.getAllMaterials);

// Route for updating a material
router.route('/:id')
    .patch(materialController.updateMaterial);


// Route for rendering the list of uploaded files

export default router;
