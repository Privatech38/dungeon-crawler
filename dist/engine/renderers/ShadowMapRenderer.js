import { vec3, mat4 } from 'glm';

import {BaseRenderer} from "./BaseRenderer.js";
import { KHRLightExtension } from "../../gpu/object/KhronosLight.js";
import {getGlobalViewMatrix, getLocalModelMatrix, getProjectionMatrix} from "../core/SceneUtils.js";
import {Model} from "../core/Model.js";

const vertexBufferLayout = {
    arrayStride: 32,
    attributes: [
        {
            name: 'position',
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
        },
        {
            name: 'texcoords',
            shaderLocation: 1,
            offset: 12,
            format: 'float32x2',
        },
        {
            name: 'normal',
            shaderLocation: 2,
            offset: 20,
            format: 'float32x3',
        },
    ],
};

const lightViewProjectionBindGroupLayout = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: { type: "uniform" }
        }
    ]
}

const modelBindGroupLayout = {
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
const SHADOW_MAP_SIZE = 512

export class ShadowMapRenderer extends BaseRenderer {
    shadowMaps;

    constructor(canvas) {
        super(canvas);
        this.perFragment = false;
        this.shadowMaps = new Map();
    }

    async initialize() {

        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter.requestDevice();
        const format = navigator.gpu.getPreferredCanvasFormat();

        this.device = device;
        this.format = format;

        const shader = await fetch('engine/renderers/ShadowMap.wgsl').then(response => response.text());

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
     * @returns {{ texture: WebGLTexture, textureView: GPUTextureView }} An object representing the texture and it's view
     */
    prepareShadowMap(light) {
        if (this.shadowMaps.has(light)) {
            return this.shadowMaps.get(light);
        }

        const texture = this.device.createTexture({
            label: "ShadowMap",
            size: [SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        });

        const textureView = texture.createView();

        const textureObject = { texture, textureView };
        this.shadowMaps.set(light, textureObject);
        return textureObject;
    }

    /**
     * Prepare a buffer for the light's view and projection matrices
     * @param light A node that has a KhronosLight component
     * @returns {{lightUniformBuffer: WebGLBuffer, lightBindGroup: GPUBindGroup}}
     */
    prepareLight(light) {
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

    prepareNode(node) {
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

    renderSceneLights(scene) {
        scene.filter(node => node.getComponentOfType(KHRLightExtension)).forEach(node => {
            this.render(scene, node);
        })
    }

    render(scene, light) {
        const shadowMap = this.prepareShadowMap(light);
        const shadowMapView = shadowMap.textureView;

        const encoder = this.device.createCommandEncoder();
        this.renderPass = encoder.beginRenderPass({
            label: "Shadow Map Render Pass",
            colorAttachments: [],
            depthStencilAttachment: {
                view: shadowMapView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard',
            },
        });

        this.renderPass.setPipeline(this.pipeline);

        // Setup view and projection matrix
        const khronosLight = light.getComponentOfType(KHRLightExtension);
        const viewMatrix = getGlobalViewMatrix(light);
        const projectionMatrix = getProjectionMatrix(light);
        const { lightUniformBuffer, lightBindGroup } = this.prepareLight(khronosLight);
        this.device.queue.writeBuffer(lightUniformBuffer, 0, viewMatrix);
        this.device.queue.writeBuffer(lightUniformBuffer, 64, projectionMatrix);
        this.renderPass.setBindGroup(0, lightBindGroup);

        this.renderNode(scene);

        this.renderPass.end();
        this.device.queue.submit([encoder.finish()]);

    }

    renderNode(node, modelMatrix = mat4.create()) {
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

    renderModel(model) {
        for (const primitive of model.primitives) {
            this.renderPrimitive(primitive);
        }
    }

    renderPrimitive(primitive) {

        const { vertexBuffer, indexBuffer } = this.prepareMesh(primitive.mesh, vertexBufferLayout);
        this.renderPass.setVertexBuffer(0, vertexBuffer);
        this.renderPass.setIndexBuffer(indexBuffer, 'uint32');

        this.renderPass.drawIndexed(primitive.mesh.indices.length);
    }

}