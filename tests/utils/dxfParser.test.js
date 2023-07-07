import parseDxfFile from "../../utils/dxfParser.js";
import fs from 'fs/promises';

jest.mock('dxf-parser', () => {
    return jest.fn().mockImplementation(() => {
        return {
            parseSync: jest.fn((fileContents) => {
                if (fileContents === 'LINE DXF file contents') {
                    return {
                        entities: [
                            {
                                type: 'LINE',
                                vertices: [{x: 0, y: 0, z: 0}, {x: 5, y: 5, z: 0}],
                            },
                        ],
                    };
                } else if (fileContents === 'POLYLINE DXF file contents') {
                    return {
                        entities: [
                            {
                                type: 'POLYLINE',
                                vertices: [
                                    {x: 0, y: 0, z: 0},
                                    {x: 10, y: 10, z: 0},
                                    {x: 20, y: 0, z: 0},
                                    {x: 20, y: 10, z: 0},
                                ],
                                closed: false,
                            },
                        ],
                    };
                } else if (fileContents === 'CIRCLE DXF file contents') {
                    return {
                        entities: [
                            {
                                type: 'CIRCLE',
                                center: {x: 10, y: 10, z: 0},
                                radius: 10,
                            }
                        ]
                    }
                } else if (fileContents === 'SPLINE DXF file contents') {
                    return {
                        entities: [
                            {
                                type: 'SPLINE',
                                controlPoints: [
                                    { x: 0, y: 0, z: 0 },
                                    { x: 1, y: 3, z: 0 },
                                    { x: 4, y: 6, z: 0 },
                                    { x: 8, y: 6, z: 0 },
                                    { x: 12, y: 4, z: 0 },
                                    { x: 14, y: 4, z: 0 },
                                    { x: 17, y: 5, z: 0 },
                                    { x: 18, y: 6, z: 0 },
                                    { x: 18, y: 8, z: 0 },
                                    { x: 18, y: 9, z: 0 },
                                    { x: 20, y: 10, z: 0 }
                                ]
                            }
                        ]
                    }
                } else if (fileContents === 'ARC DXF file contents') {
                    return {
                        entities: [
                            {
                                type: 'ARC',
                                center: { x: -10, y: 0, z: 0 },
                                radius: 10,
                                extrusionDirectionX: 0,
                                extrusionDirectionY: 0,
                                extrusionDirectionZ: -1,
                                startAngle: 0,
                                endAngle: 2.2794225989225674,
                                angleLength: 2.2794225989225674
                            }
                        ]
                    }
                }
            }),
        };
    });
});

// Mock the fs module
jest.mock('fs/promises', () => ({
    readFile: jest.fn((filePath) => {
        if (filePath === '/path/to/line/file.dxf') {
            return Promise.resolve('LINE DXF file contents');
        } else if (filePath === '/path/to/polyline/file.dxf') {
            return Promise.resolve('POLYLINE DXF file contents');
        } else if (filePath === '/path/to/circle/file.dxf') {
            return Promise.resolve('CIRCLE DXF file contents');
        } else if (filePath === '/path/to/spline/file.dxf') {
            return Promise.resolve('SPLINE DXF file contents');
        } else if (filePath === '/path/to/arc/file.dxf') {
            return Promise.resolve('ARC DXF file contents');
        }
    }),
}));

describe('parseDxfFile', () => {
    it('should calculate total length, contour count, and bounding box for a LINE entity', async () => {
        const result = await parseDxfFile('/path/to/line/file.dxf');

        // Assert the expected values based on your input DXF data
        expect(result.totalLength).toBeCloseTo(7.071, 3);
        expect(result.contourCount).toBe(1);
        expect(result.boundingBox).toEqual({
            width: 5,
            height: 5,
        });

        // Assert that readFile and parseSync methods were called correctly
        expect(fs.readFile).toHaveBeenCalledWith('/path/to/line/file.dxf', 'utf-8');
    });

    it('should calculate total length, contour count, and bounding box for a POLYLINE entity', async () => {
        const result = await parseDxfFile('/path/to/polyline/file.dxf');

        // Assert the expected values based on your input DXF data
        expect(result.totalLength).toBeCloseTo(38.284, 3);
        expect(result.contourCount).toBe(1);
        expect(result.boundingBox).toEqual({
            width: 20,
            height: 10,
        });

        // Assert that readFile and parseSync methods were called correctly
        expect(fs.readFile).toHaveBeenCalledWith('/path/to/polyline/file.dxf', 'utf-8');
    });

    it('should calculate total length, contour count, and bounding box for a CIRCLE entity', async () => {
        const result = await parseDxfFile('/path/to/circle/file.dxf');

        // Assert the expected values based on your input DXF data
        expect(result.totalLength).toBeCloseTo(62.832, 3);
        expect(result.contourCount).toBe(1);
        expect(result.boundingBox).toEqual({
            width: 20,
            height: 20,
        });

        // Assert that readFile and parseSync methods were called correctly
        expect(fs.readFile).toHaveBeenCalledWith('/path/to/circle/file.dxf', 'utf-8');
    });

    it('should calculate total length, contour count, and bounding box for a SPLINE entity', async () => {
        const result = await parseDxfFile('/path/to/spline/file.dxf');

        // Assert the expected values based on your input DXF data
        expect(result.totalLength).toBeCloseTo(26.548, 0);
        expect(result.contourCount).toBe(1);
        expect(result.boundingBox).toEqual({
            width: 20,
            height: 10,
        });

        // Assert that readFile and parseSync methods were called correctly
        expect(fs.readFile).toHaveBeenCalledWith('/path/to/spline/file.dxf', 'utf-8');
    });

    it('should calculate total length, contour count, and bounding box for a ARC entity', async () => {
        const result = await parseDxfFile('/path/to/arc/file.dxf');

        // Assert the expected values based on your input DXF data
        expect(result.totalLength).toBeCloseTo(22.794, 3);
        expect(result.contourCount).toBe(1);
        expect(result.boundingBox.width).toBeCloseTo(16.51, 2);
        expect(result.boundingBox.height).toBeCloseTo(10, 2);

        // Assert that readFile and parseSync methods were called correctly
        expect(fs.readFile).toHaveBeenCalledWith('/path/to/arc/file.dxf', 'utf-8');
    });

});
