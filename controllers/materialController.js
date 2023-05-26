import Material from '../models/materialModel.js';
import * as factory from './handlerFactory.js';

export const getAllMaterials = factory.getAll(Material);
export const createMaterial = factory.createOne(Material);
export const updateMaterial = factory.updateOne(Material);

/*
export const materialController = {
    createMaterial: async (req, res) => {
        try {
            const { material, thicknesses } = req.body;

            // Create a new material instance
            const newMaterial = new Material({
                material,
                thicknesses,
            });

            // Save the new material to the database
            const savedMaterial = await newMaterial.save();

            // Return a success response
            return res.status(201).json(savedMaterial);
        } catch (error) {
            // Handle any errors that occur during the creation process
            console.error(error);
            return res.status(500).json({ error: 'Failed to create the material' });
        }
    },

    updateMaterial: async (req, res) => {
        try {
            const { materialId } = req.params;
            const { thicknesses } = req.body;

            // Find the material by its ID
            const material = await Material.findById(materialId);

            if (!material) {
                return res.status(404).json({ error: 'Material not found' });
            }

            // Update the thicknesses of the material
            material.thicknesses = thicknesses;

            // Save the updated material
            const updatedMaterial = await material.save();

            // Return the updated material
            return res.json(updatedMaterial);
        } catch (error) {
            // Handle any errors that occur during the update process
            console.error(error);
            return res.status(500).json({ error: 'Failed to update the material' });
        }
    },
};
*/
