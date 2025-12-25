export class Accessor {
    buffer: ArrayBuffer | SharedArrayBuffer | null;
    view: any;
    offset: number;
    stride: number;
    offsetInElements: number;
    strideInElements: number;
    count: number;
    componentType: any;
    componentCount: number;
    componentSize: number;
    componentSigned: boolean;
    componentNormalized: boolean;
    normalize: (x: any) => any;
    denormalize: (x: any) => any;
    constructor({
        componentType = 'int',
        componentCount = 1,
        componentSigned = false,
        componentNormalized = false,
        componentSize = 1,

        stride = componentSize,
        buffer = null,
        viewLength = null,
        viewOffset = 0,
        offset = 0,

    }: {
        buffer?: any;
        viewLength?: number | null;
        viewOffset?: number;
        offset?: number;
        componentSize?: number;
        stride?: number;
        componentType?: string;
        componentCount?: number;
        componentSigned?: boolean;
        componentNormalized?: boolean;
    } = {}) {
        this.buffer = buffer;
        this.offset = offset;
        this.stride = stride;

        this.componentType = componentType;
        this.componentCount = componentCount;
        this.componentSize = componentSize;
        this.componentSigned = componentSigned;
        this.componentNormalized = componentNormalized;

        const viewType = this.getViewType({
            componentType,
            componentSize,
            componentSigned,
        });

        if (!viewType) {
            throw new Error();
        }

        if (viewLength !== undefined && viewLength !== null) {
            this.view = new viewType(buffer, viewOffset, viewLength / viewType.BYTES_PER_ELEMENT);
        } else {
            this.view = new viewType(buffer, viewOffset);
        }

        this.offsetInElements = offset / viewType.BYTES_PER_ELEMENT;
        this.strideInElements = stride / viewType.BYTES_PER_ELEMENT;

        this.count = Math.floor((this.view.length - this.offsetInElements) / this.strideInElements);

        this.normalize = this.getNormalizer({
            componentType,
            componentSize,
            componentSigned,
            componentNormalized,
        });

        this.denormalize = this.getDenormalizer({
            componentType,
            componentSize,
            componentSigned,
            componentNormalized,
        });
    }

    get(index: number) {
        const start = index * this.strideInElements + this.offsetInElements;
        const end = start + this.componentCount;
        return [...this.view.slice(start, end)].map(this.normalize);
    }

    set(index: number, value: any[]) {
        const start = index * this.strideInElements + this.offsetInElements;
        this.view.set(value.map(this.denormalize), start);
    }

    getNormalizer({
        componentType,
        componentSize,
        componentSigned,
        componentNormalized,
    }: {
        componentType: string;
        componentSize: number;
        componentSigned: boolean;
        componentNormalized: boolean;
    }): (x: number) => number {
        if (!componentNormalized || componentType === 'float') {
            return (x: number) => x;
        }

        const multiplier = componentSigned
            ? 2 ** ((componentSize * 8) - 1) - 1
            : 2 ** (componentSize * 8) - 1;

        return (x: number) => Math.max(x / multiplier, -1);
    }

    getDenormalizer({
        componentType,
        componentSize,
        componentSigned,
        componentNormalized,
    }: {
        componentType: string;
        componentSize: number;
        componentSigned: boolean;
        componentNormalized: boolean;
    }): (x: number) => number {
        if (!componentNormalized || componentType === 'float') {
            return (x: number) => x;
        }

        const multiplier = componentSigned
            ? 2 ** ((componentSize * 8) - 1) - 1
            : 2 ** (componentSize * 8) - 1;

        const min = componentSigned ? -1 : 0;
        const max = 1;

        return (x: number) => Math.floor(0.5 + multiplier * Math.min(Math.max(x, min), max));
    }

    getViewType({
        componentType,
        componentSize,
        componentSigned,
    }: {
        componentType: string;
        componentSize: number;
        componentSigned: boolean;
    }) {
        if (componentType === 'float') {
            if (componentSize === 4) {
                return Float32Array;
            }
        } else if (componentType === 'int') {
            if (componentSigned) {
                switch (componentSize) {
                    case 1: return Int8Array;
                    case 2: return Int16Array;
                    case 4: return Int32Array;
                }
            } else {
                switch (componentSize) {
                    case 1: return Uint8Array;
                    case 2: return Uint16Array;
                    case 4: return Uint32Array;
                }
            }
        }
    }

}
