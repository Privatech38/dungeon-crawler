export class Texture {

    image: any;
    sampler: any;
    isSRGB: boolean;

    constructor({
        image,
        sampler,
        isSRGB = false,
    }: {
        image?: any;
        sampler?: any;
        isSRGB?: boolean;
    } = {}) {
        this.image = image;
        this.sampler = sampler;
        this.isSRGB = isSRGB;
    }

    get width() {
        return this.image?.width;
    }

    get height() {
        return this.image?.height;
    }

}
