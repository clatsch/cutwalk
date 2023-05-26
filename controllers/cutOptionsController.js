import CutOption from '../models/cutOptionsModel.js';
import * as factory from './handlerFactory.js';

export const getAllCutOptions = factory.getAll(CutOption);
export const createCutOption = factory.createOne(CutOption);
export const updateCutOption = factory.updateOne(CutOption);
