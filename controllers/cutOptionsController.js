import CutOption from '../models/cutOptionsModel.js';
import * as factory from './handlerFactory.js';
import * as authController from "./authController.js";
import router from "../routes/userRoutes.js";

router.use(authController.protect);
export const getAllCutOptions = factory.getAll(CutOption);


router.use(authController.restrictsTo('admin'));
export const createCutOption = factory.createOne(CutOption);
export const updateCutOption = factory.updateOne(CutOption);
