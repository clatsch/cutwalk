import Material from '../models/materialModel.js';

const priceController = {
    calculatePrice: async (req, res) => {
        try {
            const { totalLength, materialId } = req.body;

            // Retrieve the material from the database
            const material = await Material.findById(materialId);

            if (!material) {
                return res.status(404).json({ error: 'Material not found' });
            }

            // Perform the price calculation based on the total length and material values
            const price = totalLength * material.pricePerUnit;

            // Return the calculated price
            return res.json({ price });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to calculate the price' });
        }
    },
};

export default priceController;
