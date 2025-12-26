// @ts-ignore
import {mat4, vec3} from 'glm';
import {BaseRenderer} from "./BaseRenderer";
import {KHRLightExtension, LightType} from "../../gpu/object/KhronosLight";
// @ts-ignore
import {getGlobalModelMatrix, getGlobalViewMatrix, getLocalModelMatrix} from "../core/SceneUtils.js";
// @ts-ignore
import {Model} from "../core/Model.js";

// @ts-ignore
import shadowShader from './ShadowMap.wgsl';
// @ts-ignore
import {Node} from "engine/core/Node";
// @ts-ignore
import {Primitive} from "engine/core/Primitive.js";
import {LightIndex} from "../../gpu/object/LightIndex";

export const FAR_PLANE = 100;

const vertexBufferLayout: GPUVertexBufferLayout = {
    label: "Shadow vertex buffer layout",
    arrayStride: 32,
    attributes: [
        {
            // @ts-ignore
            name: 'position',
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
        },
        {
            // @ts-ignore
            name: 'texcoords',
            shaderLocation: 1,
            offset: 12,
            format: 'float32x2',
        },
        {
            // @ts-ignore
            name: 'normal',
            shaderLocation: 2,
            offset: 20,
            format: 'float32x3',
        },
    ],
};

const lightViewProjectionBindGroupLayout: GPUBindGroupLayoutDescriptor = {
    label: "Light view and projection bind group layout",
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: { type: "uniform" }
        }
    ]
}

const modelBindGroupLayout: GPUBindGroupLayoutDescriptor = {
    label: "Model bind group layout",
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: { type: "uniform" }
        }
    ]
}

/**
 * Defines the size of a shadow map as SHADOW_MAP_SIZE x SHADOW_MAP_SIZE. The higher you set this value, the higher
 * resolution of shadows
 * @type {number}
 */
export const SHADOW_MAP_SIZE: number = 512

class CubeFace {
    targetDirection;
    upVector;

    constructor(targetDirection: Array<number>, upVector: Array<number>) {
        this.targetDirection = targetDirection;
        this.upVector = upVector;
    }

    toViewMatrix(positionMatrix: Array<number>) {
        const position = vec3.fromValues(positionMatrix[12], positionMatrix[13], positionMatrix[14]);
        let viewMatrix = mat4.create();
        const direction = vec3.create();
        vec3.add(direction, position, this.targetDirection)
        mat4.lookAt(viewMatrix, position, direction, this.upVector);
        return viewMatrix;
    }
}

const CUBE_VECTORS = [
    new CubeFace([1,0,0], [0,-1,0]),  // +X
    new CubeFace([-1,0,0], [0,-1,0]), // -X
    new CubeFace([0,1,0], [0,0,1]),   // +Y
    new CubeFace([0,-1,0], [0,0,-1]), // -Y
    new CubeFace([0,0,1], [0,-1,0]),  // +Z
    new CubeFace([0,0,-1], [0,-1,0])  // -Z
]

const PERSPECTIVE_MATRIX = mat4.perspectiveZO(mat4.create(), Math.PI / 2, 1, 0.01, FAR_PLANE);
const ORTHOGRAPHIC_MATRIX = mat4.orthoZO(mat4.create(), -10, 10, -10, 10, 0.01, FAR_PLANE);

export class ShadowMapRenderer extends BaseRenderer {
    shadowMapNodeViews: Map<Node, Array<GPUTextureView>>;
    // @ts-ignore
    lightViewProjectionBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    modelBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    pipeline: GPURenderPipeline;
    // @ts-ignore
    adapter: GPUAdapter;
    // @ts-ignore
    shadowMapArray: GPUTexture;
    // @ts-ignore
    shadowMapView: GPUTextureView;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.shadowMapNodeViews = new Map();
    }

    async initialize() {
        // @ts-ignore
        this.format = navigator.gpu.getPreferredCanvasFormat();

        const shader = await fetch(shadowShader).then(response => response.text());

        const shaderModule = this.device.createShaderModule({ code: shader });

        this.lightViewProjectionBindGroupLayout = this.device.createBindGroupLayout(lightViewProjectionBindGroupLayout);
        this.modelBindGroupLayout = this.device.createBindGroupLayout(modelBindGroupLayout);

        const layout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.lightViewProjectionBindGroupLayout,
                this.modelBindGroupLayout
            ],
        });

        this.pipeline = await this.device.createRenderPipelineAsync({
            label: "Shadow map pipeline",
            vertex: {
                module: shaderModule,
                buffers: [ vertexBufferLayout ],
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            layout,
        });

    }

    /**
     * Create a new shadow map with size of {@linkcode SHADOW_MAP_SIZE} or return an existing shadow map associated with
     * this light node
     * @param light A node with {@linkcode KHRLightExtension} component
     * @returns textureViews: Array<GPUTextureView> An object representing the textures and their views
     */
    prepareShadowMapViews(light: Node): Array<GPUTextureView> {
        if (this.shadowMapNodeViews.has(light)) {
            // @ts-ignore
            return this.shadowMapNodeViews.get(light);
        }

        const lightIndex: LightIndex = light.getComponentOfType(LightIndex);

        let textureViews = [0,1,2,3,4,5].map(index => this.shadowMapArray.createView({
            label: "Shadow map (cube) view",
            dimension: "2d",
            arrayLayerCount: 1,
            baseArrayLayer: index + lightIndex.index * 6
        }));

        this.shadowMapNodeViews.set(light, textureViews);
        return textureViews;
    }

    /**
     * Prepare a buffer for the light's view and projection matrices
     * @param light A node that has a KhronosLight component
     * @returns {{lightUniformBuffer: GPUBuffer, lightBindGroup: GPUBindGroup}} the buffer and bind group
     */
    prepareLight(light: Node): { lightUniformBuffer: GPUBuffer; lightBindGroup: GPUBindGroup; } {
        if (this.gpuObjects.has(light)) {
            return this.gpuObjects.get(light);
        }

        const lightUniformBuffer = this.device.createBuffer({
            label: "Shadow light buffer",
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const lightBindGroup = this.device.createBindGroup({
            label: "Shadow light bind group",
            layout: this.lightViewProjectionBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: lightUniformBuffer } },
            ],
        });

        const gpuObjects = { lightUniformBuffer, lightBindGroup };
        this.gpuObjects.set(light, gpuObjects);
        return gpuObjects;
    }

    prepareNode(node: Node) {
        if (this.gpuObjects.has(node)) {
            return this.gpuObjects.get(node);
        }

        const modelUniformBuffer = this.device.createBuffer({
            label: "Model uniform buffer",
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const modelBindGroup = this.device.createBindGroup({
            label: "Model bind group",
            layout: this.modelBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: modelUniformBuffer } },
            ],
        });

        const gpuObjects = { modelUniformBuffer, modelBindGroup };
        this.gpuObjects.set(node, gpuObjects);
        return gpuObjects;
    }

    /**
     * Renders the scene (node), by creating shadow/depth maps for every node with KHRLightExtension component.
     * If a light node is already cached it will not render it's shadow/depth map(s)
     * @param scene A scene
     * @return {{ shadowMap: GPUTextureView; shadowMapView: GPUTextureView, lights: Node[] }} The shadow map and it's view crated from the lights in the scene
     */
    renderSceneLights(scene: Node): { shadowMap: GPUTextureView; shadowMapView: GPUTextureView; lights: Node[] } {
        let lights: Node[] = scene.filter((node: Node) => node.getComponentOfType(KHRLightExtension));
        // Do not go over the limit on GPU
        lights.slice(0, Math.ceil(this.adapter.limits.maxTextureArrayLayers / 6));
        for (let i = 0; i < lights.length; i++) {
            lights[i].addComponent(new LightIndex(i));
        }
        // Prepare cube texture array
        this.shadowMapArray = this.device.createTexture({
            label: "Depth/Shadow texture cube array",
            format: "depth24plus",
            size: [SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, 6 * lights.length],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });
        this.shadowMapView = this.shadowMapArray.createView({
            label: "Depth/Shadow texture cube array view",
            format: "depth24plus",
            dimension: "cube-array",
            aspect: "depth-only"
        });
        // Now render all lights
        lights.forEach((light: Node) => this.render(scene, light));
        return { shadowMap: this.shadowMapView, shadowMapView: this.shadowMapView, lights: lights };
    }

    /**
     * Render shadow/depth map for this light node
     * @param scene The scene to render
     * @param light The light node
     */
    render(scene: Node, light: Node) {
        const shadowMapViews = this.prepareShadowMapViews(light);

        // Setup view and projection matrix
        const khronosLight = light.getComponentOfType(KHRLightExtension);
        const viewMatrix = getGlobalViewMatrix(light);
        const globalModelMatrix = getGlobalModelMatrix(light);
        const { lightUniformBuffer, lightBindGroup } = this.prepareLight(khronosLight);
        this.device.queue.writeBuffer(lightUniformBuffer, 64, khronosLight.type === LightType.directional ? ORTHOGRAPHIC_MATRIX : PERSPECTIVE_MATRIX);


        for (let i = 0; i < shadowMapViews.length; i++) {
            const encoder = this.device.createCommandEncoder();
            const shadowMapView = shadowMapViews[i];
            this.renderPass = encoder.beginRenderPass({
                label: "Shadow Map Render Pass",
                colorAttachments: [],
                depthStencilAttachment: {
                    view: shadowMapView,
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                }
            });

            let toViewMatrix = CUBE_VECTORS[i].toViewMatrix(globalModelMatrix);
            this.device.queue.writeBuffer(lightUniformBuffer, 0, shadowMapViews.length > 1 ? toViewMatrix : viewMatrix);
            this.renderPass.setBindGroup(0, lightBindGroup);

            this.renderPass.setPipeline(this.pipeline);

            this.renderNode(scene);

            this.renderPass.end();
            this.device.queue.submit([encoder.finish()]);
        }

    }

    renderNode(node: Node, modelMatrix = mat4.create()) {
        const localMatrix = getLocalModelMatrix(node);
        modelMatrix = mat4.multiply(mat4.create(), modelMatrix, localMatrix);
        const normalMatrix = mat4.normalFromMat4(mat4.create(), modelMatrix);

        const { modelUniformBuffer, modelBindGroup } = this.prepareNode(node);
        this.device.queue.writeBuffer(modelUniformBuffer, 0, modelMatrix);
        this.device.queue.writeBuffer(modelUniformBuffer, 64, normalMatrix);
        this.renderPass.setBindGroup(1, modelBindGroup);

        for (const model of node.getComponentsOfType(Model)) {
            this.renderModel(model);
        }

        for (const child of node.children) {
            this.renderNode(child, modelMatrix);
        }
    }

    renderModel(model: Model) {
        for (const primitive of model.primitives) {
            this.renderPrimitive(primitive);
        }
    }

    renderPrimitive(primitive: Primitive) {
        // @ts-ignore
        const { vertexBuffer, indexBuffer } = this.prepareMesh(primitive.mesh, vertexBufferLayout);
        this.renderPass.setVertexBuffer(0, vertexBuffer);
        this.renderPass.setIndexBuffer(indexBuffer, 'uint32');

        this.renderPass.drawIndexed(primitive.mesh.indices.length);
    }

}