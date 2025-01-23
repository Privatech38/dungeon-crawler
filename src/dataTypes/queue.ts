/**
 * A generic Queue implementation in TypeScript.
 * This class allows you to enqueue elements to the back of the queue
 * and dequeue elements from the front of the queue.
 */
class Queue<T> {
    private items: T[]; // Internal array to store queue elements

    /**
     * Initializes a new empty queue.
     */
    constructor() {
        this.items = [];
    }

    /**
     * Adds an element to the back of the queue.
     *
     * @param element - The element to add to the queue.
     */
    enqueue(element: T): void {
        this.items.push(element);
    }

    /**
     * Removes and returns the element at the front of the queue.
     *
     * @returns The dequeued element, or `undefined` if the queue is empty.
     */
    dequeue(): T | undefined {
        return this.items.shift();
    }

    /**
     * Returns the element at the front of the queue without removing it.
     *
     * @returns The element at the front of the queue, or `undefined` if the queue is empty.
     */
    peek(): T | undefined {
        return this.items[0];
    }

    /**
     * Checks if the queue is empty.
     *
     * @returns `true` if the queue is empty, otherwise `false`.
     */
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    /**
     * Returns the number of elements in the queue.
     *
     * @returns The size of the queue.
     */
    size(): number {
        return this.items.length;
    }

    /**
     * Clears all elements from the queue.
     */
    clear(): void {
        this.items = [];
    }

    /**
     * Returns a string representation of the queue.
     *
     * @returns A string representation of the queue.
     */
    toString(): string {
        return this.items.join(", ");
    }
}

export {Queue};