// @ts-ignore
import { vec3, mat4 } from 'glm';

// @ts-ignore
import {Camera, Model, Texture, Material, Primitive} from './engine/core.js';
import { Node } from "engine/core/Node";
import { BaseRenderer } from './engine/renderers/BaseRenderer';

import {
    getLocalModelMatrix,
    getGlobalViewMatrix,
    getProjectionMatrix,
    getGlobalModelMatrix,
    getTranslation
    // @ts-ignore
} from './engine/core/SceneUtils.js';

// @ts-ignore
import { Light } from './Light.js';

// @ts-ignore
import lamberPerFragment from './lambertPerFragment.wgsl';
// @ts-ignore
import lamberPerVertex from './lambertPerVertex.wgsl';
import {KHRLightExtension} from "./gpu/object/KhronosLight";

const vertexBufferLayout: GPUVertexBufferLayout = {
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

const cameraBindGroupLayout: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {},
        },
    ],
};

const lightBindGroupLayout: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {},
        },
    ],
};

const modelBindGroupLayout: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {},
        },
    ],
};

const materialBindGroupLayout: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {},
        },
        {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {},
        },
        {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {},
        },
    ],
};

export class Renderer extends BaseRenderer {
    private perFragment: boolean;
    // @ts-ignore
    private cameraBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    private lightBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    private modelBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    private materialBindGroupLayout: GPUBindGroupLayout;
    // @ts-ignore
    private pipelinePerFragment: GPURenderPipeline;
    // @ts-ignore
    private pipelinePerVertex: GPURenderPipeline;
    // @ts-ignore
    private depthTexture: GPUTexture;

    allLights: Node[] = [];
    lightNeighbours: WeakMap<Node, Node>;
    // @ts-ignore
    lightsBuffer: { lightsUniformBuffer: GPUBuffer, lightBindGroup: GPUBindGroup };

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.perFragment = true;
        this.lightNeighbours = new WeakMap();
    }

    async initialize() {
        await super.initialize();

        const codePerFragment = await fetch(lamberPerFragment).then(response => response.text());
        const codePerVertex = await fetch(lamberPerVertex).then(response => response.text());

        const modulePerFragment = this.device.createShaderModule({ code: codePerFragment });
        const modulePerVertex = this.device.createShaderModule({ code: codePerVertex });

        this.cameraBindGroupLayout = this.device.createBindGroupLayout(cameraBindGroupLayout);
        this.lightBindGroupLayout = this.device.createBindGroupLayout(lightBindGroupLayout);
        this.modelBindGroupLayout = this.device.createBindGroupLayout(modelBindGroupLayout);
        this.materialBindGroupLayout = this.device.createBindGroupLayout(materialBindGroupLayout);

        const layout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.cameraBindGroupLayout,
                this.lightBindGroupLayout,
                this.modelBindGroupLayout,
                this.materialBindGroupLayout,
            ],
        });

        this.pipelinePerFragment = await this.device.createRenderPipelineAsync({
            vertex: {
                module: modulePerFragment,
                buffers: [ vertexBufferLayout ],
            },
            fragment: {
                module: modulePerFragment,
                targets: [{ format: this.format }],
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            layout,
        });

        this.pipelinePerVertex = await this.device.createRenderPipelineAsync({
            vertex: {
                module: modulePerVertex,
                buffers: [ vertexBufferLayout ],
            },
            fragment: {
                module: modulePerVertex,
                targets: [{ format: this.format }],
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            layout,
        });

        this.recreateDepthTexture();
    }

    recreateDepthTexture() {
        this.depthTexture?.destroy();
        this.depthTexture = this.device.createTexture({
            format: 'depth24plus',
            size: [this.canvas.width, this.canvas.height],
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
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
     * Returns a buffer and it's bind group for 4 closest lights
     * @param node The node
     * @returns {{lightsUniformBuffer: GPUBuffer, lightBindGroup: GPUBindGroup}}
     */
    prepareLights() {
        if (this.lightsBuffer) {
            return this.lightsBuffer;
        }

        const lightsUniformBuffer = this.device.createBuffer({
            size: 4*160,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const lightBindGroup = this.device.createBindGroup({
            layout: this.lightBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: lightsUniformBuffer } },
            ],
        });

        const gpuObject = { lightsUniformBuffer, lightBindGroup };
        this.lightsBuffer = gpuObject;
        return gpuObject;
    }


    prepareCamera(camera: Camera) {
        if (this.gpuObjects.has(camera)) {
            return this.gpuObjects.get(camera);
        }

        const cameraUniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const cameraBindGroup = this.device.createBindGroup({
            layout: this.cameraBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: cameraUniformBuffer } },
            ],
        });

        const gpuObjects = { cameraUniformBuffer, cameraBindGroup };
        this.gpuObjects.set(camera, gpuObjects);
        return gpuObjects;
    }

    prepareLight(light: Light) {
        if (this.gpuObjects.has(light)) {
            return this.gpuObjects.get(light);
        }

        const lightUniformBuffer = this.device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const lightBindGroup = this.device.createBindGroup({
            layout: this.lightBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: lightUniformBuffer } },
            ],
        });

        const gpuObjects = { lightUniformBuffer, lightBindGroup };
        this.gpuObjects.set(light, gpuObjects);
        return gpuObjects;
    }

    prepareTexture(texture: Texture) {
        if (this.gpuObjects.has(texture)) {
            return this.gpuObjects.get(texture);
        }

        const { gpuTexture } = this.prepareImage(texture.image, texture.isSRGB);
        const { gpuSampler } = this.prepareSampler(texture.sampler);

        const gpuObjects = { gpuTexture, gpuSampler };
        this.gpuObjects.set(texture, gpuObjects);
        return gpuObjects;
    }

    prepareMaterial(material: Material) {
        if (this.gpuObjects.has(material)) {
            return this.gpuObjects.get(material);
        }

        const baseTexture = this.prepareTexture(material.baseTexture);

        const materialUniformBuffer = this.device.createBuffer({
            size: 48,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const materialBindGroup = this.device.createBindGroup({
            layout: this.materialBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: materialUniformBuffer } },
                { binding: 1, resource: baseTexture.gpuTexture.createView() },
                { binding: 2, resource: baseTexture.gpuSampler },
            ],
        });

        const gpuObjects = { materialUniformBuffer, materialBindGroup };
        this.gpuObjects.set(material, gpuObjects);
        return gpuObjects;
    }

    render(scene: Node, camera: Node) {
        if (this.depthTexture.width !== this.canvas.width || this.depthTexture.height !== this.canvas.height) {
            this.recreateDepthTexture();
        }

        const encoder = this.device.createCommandEncoder();
        this.renderPass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                }
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard',
            },
        });
        this.renderPass.setPipeline(this.perFragment ? this.pipelinePerFragment : this.pipelinePerVertex);

        const cameraComponent = camera.getComponentOfType(Camera);
        const viewMatrix = getGlobalViewMatrix(camera);
        const projectionMatrix = getProjectionMatrix(camera);
        const { cameraUniformBuffer, cameraBindGroup } = this.prepareCamera(cameraComponent);
        this.device.queue.writeBuffer(cameraUniformBuffer, 0, viewMatrix);
        this.device.queue.writeBuffer(cameraUniformBuffer, 64, projectionMatrix);
        this.renderPass.setBindGroup(0, cameraBindGroup);

        const light = scene.find((node: Node) => node.getComponentOfType(Light));
        const lightComponent = light?.getComponentOfType(Light);
        const lightColor = vec3.scale(vec3.create(), lightComponent.color, 1 / 255);
        const lightDirection = vec3.normalize(vec3.create(), lightComponent.direction);
        const { lightUniformBuffer, lightBindGroup } = this.prepareLight(lightComponent);
        this.device.queue.writeBuffer(lightUniformBuffer, 0, lightColor);
        this.device.queue.writeBuffer(lightUniformBuffer, 16, lightDirection);
        this.renderPass.setBindGroup(1, lightBindGroup);

        this.renderNode(scene);

        this.renderPass.end();
        this.device.queue.submit([encoder.finish()]);
    }

    renderNode(node: Node, modelMatrix = mat4.create()) {
        const localMatrix = getLocalModelMatrix(node);
        modelMatrix = mat4.multiply(mat4.create(), modelMatrix, localMatrix);
        const normalMatrix = mat4.normalFromMat4(mat4.create(), modelMatrix);

        const { modelUniformBuffer, modelBindGroup } = this.prepareNode(node);
        this.device.queue.writeBuffer(modelUniformBuffer, 0, modelMatrix);
        this.device.queue.writeBuffer(modelUniformBuffer, 64, normalMatrix);
        this.renderPass.setBindGroup(2, modelBindGroup);

        // if (node.getComponentOfType(Model)) {
        //     this.calculateLighting(node);
        // }

        for (const model of node.getComponentsOfType(Model)) {
            this.renderModel(model);
        }

        for (const child of node.children) {
            this.renderNode(child, modelMatrix);
        }
    }

    /**
     * Finds the closest 4 lights and writes their values to a buffer
     * @param node The node whose's
     */
    calculateLighting(node: Node) {
        const { lightsUniformBuffer, lightBindGroup } = this.prepareLights();
        // Use the closes 4 lights and cache them if not already
        const nodeTranslation: number[] = getTranslation(getGlobalModelMatrix(node));

        const lights = this.allLights.sort((a, b) => vec3.distanceSquared(getTranslation(getGlobalModelMatrix(a)), nodeTranslation)
            - vec3.distanceSquared(getTranslation(getGlobalModelMatrix(b)), nodeTranslation)
        ).slice(0, 4);

        const LightUniformValues = new ArrayBuffer(160);
        const LightUniformViews = {
            extension: {
                color: new Float32Array(LightUniformValues, 0, 3),
                light_type: new Uint32Array(LightUniformValues, 12, 1),
                intensity: new Float32Array(LightUniformValues, 16, 1),
                range: new Float32Array(LightUniformValues, 20, 1),
                innerConeAngle: new Float32Array(LightUniformValues, 24, 1),
                outerConeAngle: new Float32Array(LightUniformValues, 28, 1),
            },
            globalModelMatrix: new Float32Array(LightUniformValues, 32, 16),
            viewProjectionMatrix: new Float32Array(LightUniformValues, 96, 16),
        };
        for (let i = 0; i < lights.length; i++) {
            const lightNode = lights[i];
            const khrExtension: KHRLightExtension = lightNode.getComponentOfType(KHRLightExtension);

            LightUniformViews.extension.color.set(khrExtension.color);
            LightUniformViews.extension.light_type[0] = khrExtension.type;
            LightUniformViews.extension.intensity[0] = khrExtension.intensity;
            LightUniformViews.extension.range[0] = khrExtension.type;
            LightUniformViews.extension.innerConeAngle[0] = khrExtension.spot.innerConeAngle;
            LightUniformViews.extension.outerConeAngle[0] = khrExtension.spot.outerConeAngle;

            LightUniformViews.globalModelMatrix.set(getGlobalModelMatrix(lightNode));
            LightUniformViews.viewProjectionMatrix.set(getGlobalViewMatrix(lightNode));

            this.device.queue.writeBuffer(lightsUniformBuffer, i * 160, LightUniformValues);
        }
        this.renderPass.setBindGroup(1, lightBindGroup);
    }

    renderModel(model: Model) {
        for (const primitive of model.primitives) {
            this.renderPrimitive(primitive);
        }
    }

    renderPrimitive(primitive: Primitive) {
        const { materialUniformBuffer, materialBindGroup } = this.prepareMaterial(primitive.material);
        const ambientLightColor = vec3.scale(vec3.create(), primitive.material.ambientColor, 1 / 255);

        // Create the MaterialUniforms data
        const materialData = new Float32Array([
            ...primitive.material.baseFactor, // vec4f
            primitive.material.ambientFactor, // f32
            ...ambientLightColor, // vec3f
        ]);

        // Write the full struct to the buffer
        this.device.queue.writeBuffer(materialUniformBuffer, 0, materialData);

        this.renderPass.setBindGroup(3, materialBindGroup);

        const { vertexBuffer, indexBuffer } = this.prepareMesh(primitive.mesh, vertexBufferLayout);
        this.renderPass.setVertexBuffer(0, vertexBuffer);
        this.renderPass.setIndexBuffer(indexBuffer, 'uint32');

        this.renderPass.drawIndexed(primitive.mesh.indices.length);
    }

}
