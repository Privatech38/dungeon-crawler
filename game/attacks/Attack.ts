abstract class Attack{
    startPosition: { x: number, y: number, z: number };
    targetPosition: { x: number, y: number, z: number };
    damage: number;

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        damage: number
    )
    {
        this.damage = damage;
    }
    abstract execute(): void;
}

class Melee extends Attack{
    attackRange: number;

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        damage: number,
        attackRange: number
    )
    {
        super(startPosition, targetPosition, damage);
        this.attackRange = attackRange;
    }

    execute() {

    }

}