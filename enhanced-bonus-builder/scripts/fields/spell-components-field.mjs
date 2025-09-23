import BaseField from "./base-field.mjs";
import { SPELL_COMPONENTS } from "../constants.mjs";

/**
 * Filter for spell components.
 */
export default class SpellComponentsField extends BaseField {
  /**
   * @inheritdoc
   */
  appliesToBonus(bonus) {
    return ["attackRoll", "damageRoll", "savingThrowDc"].includes(bonus.type);
  }

  /**
   * @inheritdoc
   */
  createHTML(bonus) {
    const value = this.getValue(bonus) || [];
    const options = Object.entries(SPELL_COMPONENTS).map(([key, val]) => {
      const selected = value.includes(val) ? "checked" : "";
      return `<label class="checkbox">
        <input type="checkbox" name="filters.spellComponents" value="${val}" ${selected}>
        ${game.i18n.localize(`DND5E.SpellComponent${key}`)}
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
    if (!item || item.type !== "spell") return false;
    
    const components = item.system.components || {};
    
    for (const component of filter) {
      if (component === "v" && !components.vocal) return false;
      if (component === "s" && !components.somatic) return false;
      if (component === "m" && !components.material) return false;
    }
    
    return true;
  }
}