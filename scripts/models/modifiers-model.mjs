/**
 * Model for modifiers properties of a bonus.
 */

const { BooleanField, StringField } = foundry.data.fields;

/**
 * Configuration for the modifiers of a bonus.
 */
export default class ModifiersModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      enabled: new BooleanField({initial: false}),
      formula: new StringField({initial: ""}),
      target: new StringField({
        choices: ["actor", "item", "roll", "target"]
      }),
      mode: new StringField({
        choices: ["add", "multiply", "override", "upgrade", "downgrade"]
      }),
      priority: new StringField({
        choices: ["low", "normal", "high", "critical"]
      })
    };
  }

  /**
   * Apply the modifier to a value.
   * @param {number} value The value to modify.
   * @param {object} rollData The roll data.
   * @returns {number} The modified value.
   */
  async apply(value, rollData) {
    if (!this.enabled || !this.formula) return value;
    
    try {
      const roll = await new Roll(this.formula, rollData).evaluate({async: true});
      const modifier = roll.total;
      
      switch (this.mode) {
        case "add":
          return value + modifier;
        case "multiply":
          return value * modifier;
        case "override":
          return modifier;
        case "upgrade":
          return Math.max(value, modifier);
        case "downgrade":
          return Math.min(value, modifier);
        default:
          return value;
      }
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error applying modifier:", error);
      return value;
    }
  }

  /**
   * Get the priority value for sorting.
   * @returns {number} The priority value.
   */
  getPriorityValue() {
    switch (this.priority) {
      case "low": return 0;
      case "normal": return 1;
      case "high": return 2;
      case "critical": return 3;
      default: return 1;
    }
  }

  /**
   * Compare two modifiers by priority.
   * @param {ModifiersModel} a The first modifier.
   * @param {ModifiersModel} b The second modifier.
   * @returns {number} The comparison result.
   */
  static compare(a, b) {
    return a.getPriorityValue() - b.getPriorityValue();
  }
}