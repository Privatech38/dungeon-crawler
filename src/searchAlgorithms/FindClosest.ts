class FindClosest {
    private readonly array: number[];
    private readonly value: number;

    private distance: number;
    public distanceIndex: number;

    constructor(array: number[], value: number) {
        this.array = array;
        this.value = value;
        this.distance = Infinity;

        this.distanceIndex = this.findClosest(this.array, 0, array.length - 1, this.value)
    }

    private findClosest(array: number[], low: number, high: number, value: number): number {
        if (high >= low) {
            let mid = low + Math.floor((high - low) / 2);

            // If the element is present at the middle itself
            if (array[mid] == value)
                return mid;

            if (Math.abs(array[mid] - value) < this.distance) {
                this.distance = Math.abs(array[mid] - value);
                this.distanceIndex = mid;
            }

            // If element is smaller than mid, then
            // it can only be present in left subarray
            if (array[mid] > value)
                return this.findClosest(array, low, mid - 1, value);

            // Else the element can only be present
            // in right subarray
            return this.findClosest(array, mid + 1, high, value);
        }

        // We reach here when element is not
        // present in array
        return this.distanceIndex;
    }
}

export { FindClosest };