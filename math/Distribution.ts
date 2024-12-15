class Distribution {
    private readonly controlPoints: number[];
    private readonly length: number;

    private distance: number;
    public list: number[];

    constructor(controlPoints: number[], length: number) {
        this.controlPoints = controlPoints;
        this.length = length;

        this.distance = this.length / (controlPoints.length - 1);
        this.list = [];
        this.generate()
    }

    private generate() {
        for (let i = 1; i < this.controlPoints.length; i++) {
            const a = this.controlPoints[i - 1];
            const b = this.controlPoints[i];
            const step = (b - a) / this.distance;
            const isLast: boolean = (i === this.controlPoints.length - 1)
            if (isLast){
                this.distance -= 1;
            }
            for (let j = 0; j < this.distance; j++) {
                this.list.push(Math.round((a + j * step) * 100)/100);
            }
            if (isLast){
                this.list.push(b);
            }
        }
    }
}

export { Distribution };