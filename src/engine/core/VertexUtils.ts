import { Accessor } from './Accessor.js';

export function parseFormat(format: { match: (arg0: RegExp) => { (): any; new(): any; groups: any; }; }) {
    const regex = /(?<type>float|((?<sign>u|s)(?<norm>int|norm)))(?<bits>\d+)x(?<count>\d+)/;
    const groups = format.match(regex).groups;

    return {
        componentType: groups.type === 'float' ? 'float' : 'int',
        componentNormalized: groups.norm === 'norm',
        componentSigned: groups.sign === 's',
        componentSize: Number(groups.bits) / 8,
        componentCount: Number(groups.count),
    };
}

export function createVertexBuffer(vertices: string | any[], layout: { arrayStride: number; attributes: any[]; }) {
    const buffer = new ArrayBuffer(layout.arrayStride * vertices.length);
    const accessors = layout.attributes.map((attribute) => {
        if (!attribute) throw new Error('Attribute is undefined');
        return new Accessor({
            buffer,
            stride: layout.arrayStride,
            ...parseFormat(attribute.format),
            ...attribute,
        });
    });

    for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        for (let j = 0; j < layout.attributes.length; j++) {
            const accessor = accessors[j];
            const attribute = layout.attributes[j].name;
            accessor.set(i, vertex[attribute]);
        }
    }

    return buffer;
}
