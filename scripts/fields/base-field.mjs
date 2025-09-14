/**
 * Base class for all filter fields.
 */
export default class BaseField {
  /**
   * Get the name of the field.
   * @returns {string} The name of the field.
   */
  get name() {
    return `ENHANCEDBONUSBUILDER.Filters.${this.constructor.name.replace("Field", "").toLowerCase()}`;
  }

  /**
   * Get the hint for the field.
   * @returns {string} The hint for the field.
   */
  get hint() {
    return `ENHANCEDBONUSBUILDER.Filters.${this.constructor.name.replace("Field", "").toLowerCase()}.hint`;
  }

  /**
   * Check if this field applies to a given bonus.
   * @param {Babonus} bonus The bonus to check.
   * @returns {boolean} Whether the field applies to the bonus.
   */
  appliesToBonus(bonus) {
    return true;
  }

  /**
   * Check if this field is available for a given document.
   * @param {Document} document The document to check.
   * @returns {boolean} Whether the field is available.
   */
  availableFor(document) {
    return true;
  }

  /**
   * Get the storage location for this field.
   * @param {Babonus} bonus The bonus to get the storage for.
   * @returns {object} The storage location.
   */
  storage(bonus) {
    return bonus.filters;
  }

  /**
   * Create the HTML for this field.
   * @param {Babonus} bonus The bonus to create the HTML for.
   * @returns {string} The HTML for the field.
   */
  createHTML(bonus) {
    return `<div class="form-group">
      <label>${game.i18n.localize(this.name)}</label>
      <div class="form-fields">
        <input type="text" name="filters.${this.constructor.name.replace("Field", "").toLowerCase()}" value="${this.getValue(bonus) || ""}">
      </div>
      <p class="hint">${game.i18n.localize(this.hint)}</p>
    </div>`;
  }

  /**
   * Get the value of this field for a given bonus.
   * @param {Babonus} bonus The bonus to get the value for.
   * @returns {*} The value of the field.
   */
  getValue(bonus) {
    const storage = this.storage(bonus);
    const key = this.constructor.name.replace("Field", "").toLowerCase();
    return storage[key];
  }

  /**
   * Set the value of this field for a given bonus.
   * @param {Babonus} bonus The bonus to set the value for.
   * @param {*} value The value to set.
   * @returns {Babonus} The updated bonus.
   */
  setValue(bonus, value) {
    const storage = this.storage(bonus);
    const key = this.constructor.name.replace("Field", "").toLowerCase();
    storage[key] = value;
    return bonus;
  }

  /**
   * Check if this field applies to a given context.
   * @param {Babonus} bonus The bonus to check.
   * @param {*} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {Promise<boolean>} Whether the field applies.
   */
  async applies(bonus, filter, context) {
    return true;
  }
}