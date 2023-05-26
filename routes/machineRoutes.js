import express from 'express';
import * as machineController from '../controllers/machineController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

router.route('/')
    .post(machineController.createMachine)
    .get(machineController.getAllMachines);

router.route('/:id')
    .get(machineController.getMachine)
    .patch(machineController.updateMachine);


// Route for rendering the list of uploaded files

export default router;
