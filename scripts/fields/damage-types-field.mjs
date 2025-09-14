import BaseField from "./base-field.mjs";
import { DAMAGE_TYPES } from "../constants.mjs";

/**
 * Filter for damage types.
 */
export default class DamageTypesField extends BaseField {
  /**
   * @inheritdoc
   */
  appliesToBonus(bonus) {
    return ["attackRoll", "damageRoll"].includes(bonus.type);
  }

  /**
   * @inheritdoc
   */
  createHTML(bonus) {
    const value = this.getValue(bonus) || [];
    const options = DAMAGE_TYPES.map(type => {
      const selected = value.includes(type) ? "checked" : "";
      return `<label class="checkbox">
        <input type="checkbox" name="filters.damageTypes" value="${type}" ${selected}>
        ${game.i18n.localize(`DND5E.Damage${type.capitalize()}`)}
      </label>`;
    }).join("");

    return `<div class="form-group">
      <label>${game.i18n.localize(this.name)}</label>
      <div class="form-fields">
        ${options}
      </div>
      <p class="hint">${game.i18n.localize(this.hint)}</p>
    </div>`;
  }

  /**
   * @inheritdoc
   */
  async applies(bonus, filter, context) {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item) return false;
    
    // Check for damage types in the item
    if (item.system.damage?.parts) {
      for (const [, damageType] of item.system.damage.parts) {
        if (filter.includes(damageType)) return true;
      }
    }
    
    // Check for damage types in the bonus itself
    if (bonus.damageType && filter.includes(bonus.damageType)) return true;
    
    return false;
  }
}