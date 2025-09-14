/**
 * Model for aura properties of a bonus.
 */

const { BooleanField, NumberField, SchemaField, SetField, StringField } = foundry.data.fields;

/**
 * Configuration for the aura properties of a bonus.
 */
export default class AuraModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      enabled: new BooleanField({initial: false}),
      template: new BooleanField({initial: false}),
      range: new StringField({initial: "30"}),
      self: new BooleanField({initial: false}),
      disposition: new NumberField({initial: 0, integer: true, choices: [-1, 0, 1]}),
      blockers: new SetField(new StringField()),
      require: new SchemaField({
        move: new BooleanField({initial: false}),
        sight: new BooleanField({initial: false})
      })
    };
  }

  /**
   * Check if this aura applies to a given target.
   * @param {Token} source The source token.
   * @param {Token} target The target token.
   * @returns {boolean} Whether the aura applies.
   */
  applies(source, target) {
    // If not enabled, aura doesn't apply
    if (!this.enabled) return false;

    // Check if target is self and self is allowed
    const isSelf = source.id === target.id;
    if (isSelf && !this.self) return false;

    // Check disposition
    if (this.disposition !== 0) {
      const disposition = source.document.disposition * target.document.disposition;
      if (this.disposition === 1 && disposition <= 0) return false;
      if (this.disposition === -1 && disposition >= 0) return false;
    }

    // Check range
    const range = parseInt(this.range);
    if (!isNaN(range)) {
      const distance = canvas.grid.measureDistance(source, target);
      if (distance > range) return false;
    }

    // Check blockers
    if (this.blockers.size > 0) {
      const effects = target.actor?.effects.filter(e => e.statuses) ?? [];
      for (const effect of effects) {
        for (const status of effect.statuses) {
          if (this.blockers.has(status)) return false;
        }
      }
    }

    // Check requirements
    if (this.require.move || this.require.sight) {
      // Check line of movement
      if (this.require.move) {
        const ray = new Ray(source.center, target.center);
        const hasCollision = canvas.walls.checkCollision(ray);
        if (hasCollision) return false;
      }

      // Check line of sight
      if (this.require.sight) {
        const sourceVision = source.vision;
        if (!sourceVision) return false;
        
        // Check if target is within source's vision
        const targetPoint = {x: target.center.x, y: target.center.y};
        const inVision = sourceVision.contains(targetPoint.x, targetPoint.y);
        if (!inVision) return false;
      }
    }

    return true;
  }
}