export class Node {
    children: Node[];
    parent: Node | null;
    components: any[];

    constructor() {
        this.children = [];
        this.parent = null;
        this.components = [];
    }

    addChild(node: Node): void {
        node.parent?.removeChild(node);
        this.children.push(node);
        node.parent = this;
    }

    removeChild(node: Node): void {
        const index = this.children.indexOf(node);
        if (index >= 0) {
            this.children.splice(index, 1);
            node.parent = null;
        }
    }

    traverse(before?: (node: Node) => any, after?: (node: Node) => boolean) {
        before?.(this);
        for (const child of this.children) {
            child.traverse(before, after);
        }
        after?.(this);
    }

    linearize() {
        const array: Node[] = [];
        this.traverse((node: Node) => array.push(node));
        return array;
    }

    filter(predicate: (node: Node) => boolean): Node[] {
        return this.linearize().filter(predicate);
    }

    find(predicate: (node: Node) => boolean) {
        return this.linearize().find(predicate);
    }

    map(transform: (node: Node) => boolean) {
        return this.linearize().map(transform);
    }

    addComponent(component: any) {
        this.components.push(component);
    }

    removeComponent(component: any) {
        this.components = this.components.filter(c => c !== component);
    }

    removeComponentsOfType(type: any) {
        this.components = this.components.filter(component => !(component instanceof type));
    }

    getComponentOfType(type: any) {
        return this.components.find(component => component instanceof type);
    }

    getComponentsOfType(type: any) {
        return this.components.filter(component => component instanceof type);
    }

}
