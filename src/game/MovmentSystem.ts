import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
import { VelocityComponent } from "./VelocityComponent.js";

import { vec3 } from "gl-matrix";

export class MovementSystem {
  update(entities: Entity[], dt: number) {
    for (const entity of entities) {
      const transform = entity.getComponent(Transform);
      const velocity = entity.getComponent(VelocityComponent);

      if (!transform || !velocity) continue;

      // newPosition = position + velocity * dt
      const delta = vec3.create();
      vec3.scale(delta, velocity.vec, dt);
      vec3.add(transform.position, transform.position, delta);
    }
  }
}
