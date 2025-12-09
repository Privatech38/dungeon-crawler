import { Mesh, Vertex } from '../core.js';
import { Vector3 } from '../../../dist/math/Vector.js';

export class OBBToMesh {
    /**
     * Converts an Oriented Bounding Box (OBB) into a Mesh.
     *
     * @param {Object} options - The OBB parameters.
     * @param {Vector3[]} options.axes - An array of 3 orthogonal Vector3 objects defining the local axes of the OBB.
     * @param {Vector3} options.halfExtents - A Vector3 defining the half extents along each axis (width, height, depth).
     * @param {Vector3} options.center - A Vector3 specifying the center of the OBB.
     * @param {number[]} options.color - An array of RGB values [r, g, b] between 0 and 1 for vertex color.
     * @returns {Mesh} - The resulting Mesh object.
     */
    createMesh({ axes, halfExtents, center, color }) {
        // Validate input
        if (!Array.isArray(axes) || axes.length !== 3) {
            throw new Error("Axes must be an array of 3 orthogonal Vector3 objects.");
        }
        if (!halfExtents || !center || !color || color.length !== 3) {
            throw new Error("Missing or invalid inputs: halfExtents, center, or color.");
        }

        // Calculate the 8 corners of the OBB
        const corners = [];
        const extents = [
            axes[0].scale(halfExtents.x),
            axes[1].scale(halfExtents.y),
            axes[2].scale(halfExtents.z),
        ];

        // Generate corners by combining the center with the extents
        for (let i = 0; i < 8; i++) {
            const signX = (i & 1) === 0 ? 1 : -1;
            const signY = (i & 2) === 0 ? 1 : -1;
            const signZ = (i & 4) === 0 ? 1 : -1;

            const corner = center
                .add(extents[0].scale(signX))
                .add(extents[1].scale(signY))
                .add(extents[2].scale(signZ));

            corners.push(corner);
        }

        // Convert corners into vertices
        const vertices = corners.map(corner => new Vertex({
            position: corner.toArray,
            color: color,
        }));

        // Define indices for a box (12 triangles)
        const indices = [
            0, 1, 2, 2, 3, 0, // Front face
            4, 5, 6, 6, 7, 4, // Back face
            0, 4, 7, 7, 3, 0, // Left face
            1, 5, 6, 6, 2, 1, // Right face
            0, 1, 5, 5, 4, 0, // Top face
            3, 2, 6, 6, 7, 3, // Bottom face
        ];

        return new Mesh({ vertices, indices });
    }
}
