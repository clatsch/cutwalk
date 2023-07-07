import dxfParser from 'dxf-parser';
import fs from 'fs/promises';


const parseDxfFile = async (filePath) => {

        try {
            const fileContents = await fs.readFile(filePath, 'utf-8');
            const parser = new dxfParser();
            const parsedDxf = parser.parseSync(fileContents);
            let boundingBox = {}

            let totalLength = 0;
            let contourCount = 0

            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            function updateBoundingBox(x1, y1, x2, y2) {
                minX = Math.min(minX, x1);
                minY = Math.min(minY, y1);
                maxX = Math.max(maxX, x2);
                maxY = Math.max(maxY, y2);
            }

            // Calculate amount of contours
            for (const entity of parsedDxf.entities) {
                if (entity.type === 'CIRCLE' ||
                    entity.type === 'POLYLINE' ||
                    entity.type === 'LWPOLYLINE' ||
                    entity.type === 'SPLINE' ||
                    entity.type === 'LINE' ||
                    entity.type === 'ARC' ||
                    entity.type === 'ELLIPSE' ||
                    entity.type === 'INSERT'
                ) {
                    contourCount++; // increment contour count for each entity type
                }
            }

            // Calculate length of contours
            for (const entity of parsedDxf.entities) {
                if (entity.type === 'CIRCLE') {
                    const circumference = 2 * Math.PI * entity.radius;
                    totalLength += circumference;
                } else if (entity.type === 'POLYLINE' || entity.type === 'LWPOLYLINE') {
                    let polylineLength = 0;
                    const vertices = entity.vertices;
                    for (let i = 0; i < vertices.length - 1; i++) {
                        const vertex1 = vertices[i];
                        const vertex2 = vertices[i + 1];
                        const segmentLength = Math.sqrt(
                            Math.pow(vertex2.x - vertex1.x, 2) +
                            Math.pow(vertex2.y - vertex1.y, 2) +
                            Math.pow(vertex2.z - vertex1.z, 2)
                        );
                        polylineLength += segmentLength;
                    }
                    // Check if the polyline is closed
                    if (entity.shape) {
                        const firstVertex = vertices[0];
                        const lastVertex = vertices[vertices.length - 1];
                        const closingSegmentLength = Math.sqrt(
                            Math.pow(lastVertex.x - firstVertex.x, 2) +
                            Math.pow(lastVertex.y - firstVertex.y, 2) +
                            Math.pow(lastVertex.z - firstVertex.z, 2)
                        );
                        polylineLength += closingSegmentLength;
                    }
                    totalLength += polylineLength;
                } else if (entity.type === 'SPLINE') {
                    const controlPoints = entity.controlPoints;
                    if (controlPoints.length >= 3) {
                        let splineLength = 0;
                        for (let i = 0; i < controlPoints.length - 2; i += 2) {
                            const p0 = controlPoints[i];
                            const p1 = controlPoints[i + 1];
                            const p2 = controlPoints[i + 2];
                            const segmentLength = quadraticBezierLength(p0, p1, p2);
                            splineLength += segmentLength;
                        }
                        totalLength += splineLength;
                    }
                } else if (entity.type === 'LINE') {
                    const vertices = entity.vertices;
                    if (vertices && vertices.length === 2) {
                        const x1 = vertices[0].x;
                        const y1 = vertices[0].y;
                        const x2 = vertices[1].x;
                        const y2 = vertices[1].y;
                        const segmentLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                        totalLength += segmentLength;
                    }
                } else if (entity.type === 'ARC') {
                    const circumference = Math.abs(entity.endAngle - entity.startAngle) * entity.radius;
                    totalLength += circumference;

                    // console.log('Total length Arc: ' + totalLength);
                } else if (entity.type === 'ELLIPSE') {
                    const a = entity.majorAxisEndPoint.x - entity.center.x;
                    const b = entity.majorAxisEndPoint.y - entity.center.y;
                    const circumference = 2 * Math.PI * Math.sqrt(2 * (a * a + b * b) - (a - b) * (a - b));
                    totalLength += circumference;
                    // console.log('Total Ellipse: ' + totalLength);
                } else if (entity.type === 'INSERT') {
                    const block = parsedDxf.blocks[entity.name];
                    if (block) {
                        for (const entity of block.entities) {
                            // Recursively calculate total length of entities in inserted block
                            totalLength += calculateTotalLength(entity, parsedDxf);
                            // console.log('Total length Insert: ' + totalLength);
                        }
                    }
                }
            }

            // Calculate bounding-box
            for (const entity of parsedDxf.entities) {
                if (entity.type === 'CIRCLE') {
                    const {x, y, radius} = entity;
                    if (!isNaN(x) && !isNaN(y) && !isNaN(radius)) {
                        updateBoundingBox(x - radius, y - radius, x + radius, y + radius);
                    }
                } else if (entity.type === 'POLYLINE' || entity.type === 'LWPOLYLINE') {
                    const {vertices} = entity;
                    for (const vertex of vertices) {
                        const {x, y} = vertex;
                        if (!isNaN(x) && !isNaN(y)) {
                            updateBoundingBox(x, y, x, y);
                        }
                    }
                } else if (entity.type === 'SPLINE') {
                    const {controlPoints} = entity;
                    for (const point of controlPoints) {
                        const {x, y} = point;
                        if (!isNaN(x) && !isNaN(y)) {
                            updateBoundingBox(x, y, x, y);
                        }
                    }
                } else if (entity.type === 'LINE') {
                    const {vertices} = entity;
                    for (const vertex of vertices) {
                        const {x, y} = vertex;
                        if (!isNaN(x) && !isNaN(y)) {
                            updateBoundingBox(x, y, x, y);
                        }
                    }
                } else if (entity.type === 'ARC') {
                    const {x, y, radius, startAngle, endAngle} = entity;
                    if (!isNaN(x) && !isNaN(y) && !isNaN(radius) && !isNaN(startAngle) && !isNaN(endAngle)) {
                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (endAngle * Math.PI) / 180;
                        const startPoint = {
                            x: x + radius * Math.cos(startAngleRad),
                            y: y + radius * Math.sin(startAngleRad),
                        };
                        const endPoint = {
                            x: x + radius * Math.cos(endAngleRad),
                            y: y + radius * Math.sin(endAngleRad),
                        };
                        updateBoundingBox(x - radius, y - radius, x + radius, y + radius);
                        if (!isNaN(startPoint.x) && !isNaN(startPoint.y)) {
                            updateBoundingBox(startPoint.x, startPoint.y, startPoint.x, startPoint.y);
                        }
                        if (!isNaN(endPoint.x) && !isNaN(endPoint.y)) {
                            updateBoundingBox(endPoint.x, endPoint.y, endPoint.x, endPoint.y);
                        }
                    }
                } else if (entity.type === 'ELLIPSE') {
                    const {center, majorAxisEndPoint, ratio, startAngle, endAngle} = entity;
                    if (
                        !isNaN(center.x) &&
                        !isNaN(center.y) &&
                        !isNaN(majorAxisEndPoint.x) &&
                        !isNaN(majorAxisEndPoint.y) &&
                        !isNaN(ratio) &&
                        !isNaN(startAngle) &&
                        !isNaN(endAngle)
                    ) {
                        // Calculate the bounding box coordinates for the ellipse
                        const a = majorAxisEndPoint.x - center.x;
                        const b = majorAxisEndPoint.y - center.y;
                        const radiusX = Math.abs(a);
                        const radiusY = Math.abs(b);
                        const rotation = Math.atan2(b, a);

                        // Convert angles to radians
                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (endAngle * Math.PI) / 180;

                        // Calculate the start and end points on the ellipse
                        const startPoint = {
                            x: center.x + radiusX * Math.cos(rotation) * Math.cos(startAngleRad) - radiusY * Math.sin(rotation) * Math.sin(startAngleRad),
                            y: center.y + radiusY * Math.sin(rotation) * Math.cos(startAngleRad) + radiusX * Math.cos(rotation) * Math.sin(startAngleRad),
                        };
                        const endPoint = {
                            x: center.x + radiusX * Math.cos(rotation) * Math.cos(endAngleRad) - radiusY * Math.sin(rotation) * Math.sin(endAngleRad),
                            y: center.y + radiusY * Math.sin(rotation) * Math.cos(endAngleRad) + radiusX * Math.cos(rotation) * Math.sin(endAngleRad),
                        };

                        // Update the bounding box coordinates
                        updateBoundingBox(center.x - radiusX, center.y - radiusY, center.x + radiusX, center.y + radiusY);
                        updateBoundingBox(startPoint.x, startPoint.y, startPoint.x, startPoint.y);
                        updateBoundingBox(endPoint.x, endPoint.y, endPoint.x, endPoint.y);
                    }
                }
                boundingBox = {
                    width: maxX !== -Infinity && minX !== Infinity ? maxX - minX : 0,
                    height: maxY !== -Infinity && minY !== Infinity ? maxY - minY : 0,
                };
            }

            console.log(parsedDxf)

            return {
                totalLength: totalLength,
                contourCount: contourCount,
                boundingBox: boundingBox,
            };

        } catch
            (err) {
            console.error(`Error parsing DXF file: ${err.message}`);
            return null;
        }
    }
;

function quadraticBezierLength(p0, p1, p2) {
    let ax = p0.x - 2 * p1.x + p2.x;
    let ay = p0.y - 2 * p1.y + p2.y;
    let bx = 2 * p1.x - 2 * p0.x;
    let by = 2 * p1.y - 2 * p0.y;
    let A = 4 * (ax * ax + ay * ay);
    let B = 4 * (ax * bx + ay * by);
    let C = bx * bx + by * by;

    let Sabc = 2 * Math.sqrt(A + B + C);
    let A_2 = Math.sqrt(A);
    let A_32 = 2 * A * A_2;
    let C_2 = 2 * Math.sqrt(C);
    let BA = B / A_2;

    return (A_32 * Sabc + A_2 * B * (Sabc - C_2) + (4 * C * A - B * B) * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) / (4 * A_32);
}

export default parseDxfFile;
