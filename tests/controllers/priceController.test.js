import priceController from "../../controllers/priceController.js";
import Material from "../../models/materialModel.js";

jest.mock('../../models/materialModel.js', () => ({
    findById: jest.fn(),
}));

describe('Price Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate the price correctly', async () => {
        const materialId = 'exampleMaterialId';
        const totalLength = 10;
        const material = { pricePerUnit: 5 };

        Material.findById.mockResolvedValue(material);

        const req = { body: { totalLength, materialId } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await priceController.calculatePrice(req, res);

        expect(Material.findById).toHaveBeenCalledWith(materialId);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ price: totalLength * material.pricePerUnit });
    });

    it('should return an error if material is not found', async () => {
        const materialId = 'nonExistentMaterialId';
        const totalLength = 10;

        // Mock the Material.findById method to return null
        Material.findById.mockResolvedValue(null);

        const req = { body: { totalLength, materialId } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await priceController.calculatePrice(req, res);

        expect(Material.findById).toHaveBeenCalledWith(materialId);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Material not found' });
    });

    it('should handle errors and return a 500 status', async () => {
        const materialId = 'exampleMaterialId';
        const totalLength = 10;
        const error = new Error('Failed to calculate the price');

        Material.findById.mockRejectedValue(error);

        const req = { body: { totalLength, materialId } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await priceController.calculatePrice(req, res);

        expect(Material.findById).toHaveBeenCalledWith(materialId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to calculate the price' });

        expect(consoleErrorSpy).toHaveBeenCalledWith(error);

        consoleErrorSpy.mockRestore();
    });
});
