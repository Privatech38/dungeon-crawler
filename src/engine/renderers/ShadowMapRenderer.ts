// @ts-ignore
import { vec3, mat4 } from 'glm';
// @ts-ignore
import { BaseRenderer } from "./BaseRenderer.js";
import { KHRLightExtension } from "../../gpu/object/KhronosLight";
import {
    getGlobalModelMatrix,
    getGlobalViewMatrix,
    getLocalModelMatrix
    // @ts-ignore
} from "../core/SceneUtils.js";
// @ts-ignore
import {Model} from "../core/Model.js";

// @ts-ignore
import shadowShader from './ShadowMap.wgsl';
// @ts-ignore
import {Node} from "engine/core/Node.js";
// @ts-ignore
import {Primitive} from "engine/core/Primitive.js";

const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 32,
    attributes: [
        {
            // position
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
        },
        {
            // texture coordinates
            shaderLocation: 1,
            offset: 12,
            format: 'float32x2',
        },
        {
            // normal
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
const SHADOW_MAP_SIZE: number = 512

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

const PERSPECTIVE_MATRIX = mat4.perspectiveZO(mat4.create(), Math.PI / 2, 1, 0.01, 1000);
const ORTHOGRAPHIC_MATRIX = mat4.orthoZO(mat4.create(), -10, 10, -10, 10, 0.01, 1000);

export class ShadowMapRenderer extends BaseRenderer {
    // @ts-ignore
    gpuObjects: Map<Node, any>;
    // @ts-ignore
    device: GPUDevice;
    format!: GPUTextureFormat;
    perFragment: boolean;
    // @ts-ignore
    renderPass: GPURenderPassEncoder;
    shadowMaps;

    // @ts-ignore
    lightViewProjectionBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    modelBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    pipeline: GPURenderPipeline;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.perFragment = false;
        this.shadowMaps = new Map();
    }

    async initialize() {

        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter?.requestDevice();
        if (!device) {
            return;
        }
        const format = navigator.gpu.getPreferredCanvasFormat();

        this.device = device;
        this.format = format;

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
     * @returns {{ texture: WebGLTexture, textureViews: Array<GPUTextureView> }} An object representing the textures and their views
     */
    prepareShadowMap(light: Node): { texture: WebGLTexture; textureViews: Array<GPUTextureView>; } {
        if (this.shadowMaps.has(light)) {
            return this.shadowMaps.get(light);
        }

        const khrLightExtension = light.getComponentOfType(KHRLightExtension);

        const texture = this.device.createTexture({
            label: "ShadowMap",
            size: [SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, khrLightExtension.type === 'point' ? 6 : 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        let textureViews;
        if (khrLightExtension.type === 'point') {
            textureViews = [0,1,2,3,4,5].map(index => texture.createView({
                label: "Shadow map (cube) view",
                dimension: "2d",
                arrayLayerCount: 1,
                baseArrayLayer: index
            }));
        } else {
            textureViews = [texture.createView({
                label: "Shadow map view"
            })];
        }

        const textureObject = { texture, textureViews };
        this.shadowMaps.set(light, textureObject);
        return textureObject;
    }

    /**
     * Prepare a buffer for the light's view and projection matrices
     * @param light A node that has a KhronosLight component
     * @returns {{lightUniformBuffer: WebGLBuffer, lightBindGroup: GPUBindGroup}}
     */
    prepareLight(light: Node): { lightUniformBuffer: GPUBuffer; lightBindGroup: GPUBindGroup; } {
        if (this.gpuObjects.has(light)) {
            return this.gpuObjects.get(light);
        }

        const lightUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const lightBindGroup = this.device.createBindGroup({
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
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const modelBindGroup = this.device.createBindGroup({
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
     */
    renderSceneLights(scene: Node) {
        scene.filter((node: Node) => node.getComponentOfType(KHRLightExtension) && !this.shadowMaps.has(node)).forEach((node: Node) => {
            this.render(scene, node);
        });
    }

    /**
     * Render shadow/depth map for this light node
     * @param scene The scene to render
     * @param light The light node
     */
    render(scene: Node, light: Node) {
        const shadowMap = this.prepareShadowMap(light);
        const shadowMapViews = shadowMap.textureViews;

        // Setup view and projection matrix
        const khronosLight = light.getComponentOfType(KHRLightExtension);
        const viewMatrix = getGlobalViewMatrix(light);
        const globalModelMatrix = getGlobalModelMatrix(light);
        const { lightUniformBuffer, lightBindGroup } = this.prepareLight(khronosLight);
        this.device.queue.writeBuffer(lightUniformBuffer, 64, khronosLight.type === 'directional' ? ORTHOGRAPHIC_MATRIX : PERSPECTIVE_MATRIX);


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