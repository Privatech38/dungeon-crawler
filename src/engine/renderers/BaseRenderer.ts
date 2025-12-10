// @ts-ignore
import * as WebGPU from '../WebGPU.js';

// @ts-ignore
import { createVertexBuffer } from '../core/VertexUtils.js';
// @ts-ignore
import { Mesh } from '../core/Mesh.js';

export class BaseRenderer {
    protected canvas: HTMLCanvasElement;
    protected gpuObjects: WeakMap<WeakKey, any>;

    // @ts-ignore
    device: GPUDevice;
    format!: GPUTextureFormat;
    // @ts-ignore
    renderPass: GPURenderPassEncoder;
    // @ts-ignore
    protected context: GPUCanvasContext;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gpuObjects = new WeakMap();
    }

    async initialize(): Promise<void> {
        const adapter: GPUAdapter | null = await navigator.gpu.requestAdapter();
        const device: GPUDevice | undefined = await adapter?.requestDevice();
        if (!device) {
            console.error('GPU device not found');
            return;
        }
        const context = this.canvas.getContext('webgpu');
        if (!context) {
            console.error('GPU context not found');
            return;
        }
        const format = navigator.gpu.getPreferredCanvasFormat();
        context?.configure({ device, format });
        this.device = device;
        this.context = context;
        this.format = format;
    }

    prepareImage(image: any, isSRGB = false) {
        if (this.gpuObjects.has(image)) {
            return this.gpuObjects.get(image);
        }

        const gpuTexture = WebGPU.createTexture(this.device, {
            source: image,
            format: isSRGB ? 'rgba8unorm-srgb' : 'rgba8unorm',
        });

        const gpuObjects = { gpuTexture };
        this.gpuObjects.set(image, gpuObjects);
        return gpuObjects;
    }

    prepareSampler(sampler: GPUSampler) {
        if (this.gpuObjects.has(sampler)) {
            return this.gpuObjects.get(sampler);
        }

        const gpuSampler = this.device.createSampler(sampler);

        const gpuObjects = { gpuSampler };
        this.gpuObjects.set(sampler, gpuObjects);
        return gpuObjects;
    }

    prepareMesh(mesh: Mesh, layout: GPUVertexBufferLayout) {
        if (this.gpuObjects.has(mesh)) {
            return this.gpuObjects.get(mesh);
        }

        const vertexBufferArrayBuffer = createVertexBuffer(mesh.vertices, layout);
        const vertexBuffer = WebGPU.createBuffer(this.device, {
            data: vertexBufferArrayBuffer,
            usage: GPUBufferUsage.VERTEX,
        });

        const indexBufferArrayBuffer = new Uint32Array(mesh.indices).buffer;
        const indexBuffer = WebGPU.createBuffer(this.device, {
            data: indexBufferArrayBuffer,
            usage: GPUBufferUsage.INDEX,
        });

        const gpuObjects = { vertexBuffer, indexBuffer };
        this.gpuObjects.set(mesh, gpuObjects);
        return gpuObjects;
    }

}
