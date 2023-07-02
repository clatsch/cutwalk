import express from 'express';
import * as materialController from '../controllers/materialController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

router.route('/')
    .get(materialController.getAllMaterials);
// This middleware will restrict all the routes that come after this point
router.use(authController.restrictsTo('admin'));

// Route for handling materials
router.route('/')
    .post(materialController.createMaterial);


// Route for updating a material
router.route('/:id')
    .get(materialController.getMaterial)
    .patch(materialController.updateMaterial)
    .delete(materialController.deleteMaterial)


// Route for rendering the list of uploaded files

export default router;
