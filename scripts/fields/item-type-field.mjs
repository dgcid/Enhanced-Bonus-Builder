import BaseField from "./base-field.mjs";
import { ITEM_TYPES } from "../constants.mjs";

/**
 * Filter for item types.
 */
export default class ItemTypeField extends BaseField {
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
    const options = ITEM_TYPES.map(type => {
      const selected = value.includes(type) ? "checked" : "";
      return `<label class="checkbox">
        <input type="checkbox" name="filters.itemType" value="${type}" ${selected}>
        ${game.i18n.localize(`ITEM.Type${type.capitalize()}`)}
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
    
    return filter.includes(item.type);
  }
}