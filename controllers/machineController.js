import Machine from '../models/machineModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';




export const getAllMachines = factory.getAll(Machine);
export const getMachine = factory.getOne(Machine);
export const createMachine = factory.createOne(Machine);
export const updateMachine = factory.updateOne(Machine);
export const deleteMachine = factory.deleteOne(Machine);
