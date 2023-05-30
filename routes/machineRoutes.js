import express from 'express';
import * as machineController from '../controllers/machineController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// This middleware will protect all the routes that come after this point
router.use(authController.protect);

router.route('/')
    .get(machineController.getAllMachines);

router.route('/:id')
    .get(machineController.getMachine)


router.use(authController.restrictsTo('admin'));
router.route('/')
    .post(machineController.createMachine)

router.route('/:id')
    .patch(machineController.updateMachine);

export default router;
