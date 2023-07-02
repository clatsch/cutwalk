import Material from '../models/materialModel.js';
import * as factory from './handlerFactory.js';

export const getAllMaterials = factory.getAll(Material);

export const getMaterial = factory.getOne(Material);
export const createMaterial = factory.createOne(Material);
export const updateMaterial = factory.updateOne(Material);
export const deleteMaterial = factory.deleteOne(Material)
