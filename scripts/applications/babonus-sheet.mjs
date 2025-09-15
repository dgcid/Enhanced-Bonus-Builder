import { MODULE } from "../constants.mjs";
import api from "../api.mjs";

/**
 * The application for editing a bonus.
 */
export default class BabonusSheet extends FormApplication {
  /**
   * @param {object} options Optional configuration parameters for how the sheet behaves
   * @param {Babonus} options.bonus The babonus managed by this sheet
   */
  constructor({bonus, ...options}) {
    super({...options, document: bonus.parent, bonusId: bonus.id});
    this.bonus = bonus;
    this.activeFilters = {};
    this.availableFilters = {};
    
    // Initialize available filters
    for (const [id, field] of Object.entries(enhancedBonusBuilder.abstract.DataFields.fields)) {
      if (field.appliesToBonus(bonus) && field.availableFor(bonus.parent)) {
        this.availableFilters[id] = {
          name: field.name,
          hint: field.hint
        };
        
        if (bonus.filters[id]) {
          this.activeFilters[id] = {
            value: bonus.filters[id],
            html: field.createHTML(bonus)
          };
        }
      }
    }
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["enhanced-bonus-builder", "sheet"],
      template: MODULE.TEMPLATES.SHEET,
      width: 600,
      height: 600,
      tabs: [{
        navSelector: ".tabs",
        contentSelector: ".tab",
        initial: "description"
      }],
      submitOnChange: false,
      closeOnSubmit: false,
      resizable: true,
      dragDrop: [{dragSelector: ".item", dropSelector: null}]
    });
  }

  /** @inheritdoc */
  get title() {
    return `${game.i18n.localize("ENHANCEDBONUSBUILDER.ModuleTitle")}: ${this.bonus.name}`;
  }

  /** @inheritdoc */
  getData() {
    const data = super.getData();
    
    // Add bonus data
    data.bonus = this.bonus;
    data.parentName = this.document.name;
    data.iconColor = "#4b6eaf";
    
    // Add filter data
    data.availableFilters = this.availableFilters;
    data.activeFilters = this.activeFilters;
    
    // Add type-specific data
    if (this.bonus.type === "damageRoll") {
      data.damageTypes = CONFIG.DND5E.damageTypes;
    }
    
    if (["savingThrow", "abilityCheck"].includes(this.bonus.type)) {
      data.abilities = CONFIG.DND5E.abilities;
    }
    
    if (this.bonus.type === "abilityCheck") {
      data.skills = CONFIG.DND5E.skills;
    }
    
    // Add consumption data
    data.consumptionTypes = {};
    if (this.document.documentName === "Actor") {
      data.consumptionTypes.attributes = "ENHANCEDBONUSBUILDER.ConsumptionTypes.attributes";
      data.consumptionTypes.currency = "ENHANCEDBONUSBUILDER.ConsumptionTypes.currency";
      data.consumptionTypes.resources = "ENHANCEDBONUSBUILDER.ConsumptionTypes.resources";
      data.consumptionTypes.hitDice = "ENHANCEDBONUSBUILDER.ConsumptionTypes.hitDice";
    }
    
    if (this.document.documentName === "Item") {
      if (this.document.system.uses?.max) {
        data.consumptionTypes.uses = "ENHANCEDBONUSBUILDER.ConsumptionTypes.uses";
      }
      if (this.document.system.consume?.type === "charges") {
        data.consumptionTypes.charges = "ENHANCEDBONUSBUILDER.ConsumptionTypes.charges";
      }
      if (this.document.type === "spell") {
        data.consumptionTypes.slots = "ENHANCEDBONUSBUILDER.ConsumptionTypes.slots";
      }
    }
    
    // Add consumption properties
    data.consumptionProperties = {};
    if (this.bonus.consumption.type) {
      const properties = enhancedBonusBuilder.abstract.DataModels.ConsumptionModel.getAvailableProperties(
        this.bonus.consumption.type,
        this.document
      );
      data.consumptionProperties = properties;
    }
    
    return data;
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    
    // Activate filter listeners
    this._activateFilterListeners(html);
    
    // Handle delete button
    html.find('[data-action="delete"]').click(this._onDelete.bind(this));
    
    // Handle duplicate button
    html.find('[data-action="duplicate"]').click(this._onDuplicate.bind(this));
    
    // Handle bonus icon
    html.find('[data-action="bonus-icon"]').click(this._onBonusIcon.bind(this));
  }

  /**
   * Activate filter listeners.
   * @param {jQuery} html The HTML element.
   * @private
   */
  _activateFilterListeners(html) {
    // Handle filter item clicks
    html.find('.filter-item').click(this._onFilterItemClick.bind(this));
    
    // Handle filter remove clicks
    html.find('[data-action="remove-filter"]').click(this._onFilterRemoveClick.bind(this));
  }

  /**
   * Handle filter item clicks.
   * @param {Event} event The click event.
   * @private
   */
  _onFilterItemClick(event) {
    const filterId = event.currentTarget.dataset.filter;
    
    // If the filter is already active, do nothing
    if (this.activeFilters[filterId]) return;
    
    // Add the filter to active filters
    const field = enhancedBonusBuilder.abstract.DataFields.fields[filterId];
    if (!field) return;
    
    this.activeFilters[filterId] = {
      value: null,
      html: field.createHTML(this.bonus)
    };
    
    // Re-render the sheet
    this.render();
  }

  /**
   * Handle filter remove clicks.
   * @param {Event} event The click event.
   * @private
   */
  _onFilterRemoveClick(event) {
    const filterId = event.currentTarget.dataset.filter;
    
    // Remove the filter from active filters
    delete this.activeFilters[filterId];
    
    // Remove the filter from the bonus
    delete this.bonus.filters[filterId];
    
    // Re-render the sheet
    this.render();
  }

  /**
   * Handle delete button clicks.
   * @param {Event} event The click event.
   * @private
   */
  async _onDelete(event) {
    const confirmed = await Dialog.confirm({
      title: game.i18n.localize("Delete Bonus"),
      content: `<p>${game.i18n.format("Are you sure you want to delete {name}?", {name: this.bonus.name})}</p>`,
      defaultYes: false
    });
    
    if (!confirmed) return;
    
    // Get the bonuses from the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag(MODULE.ID, "bonuses") || {});
    
    // Delete the bonus
    delete bonuses[this.bonus.id];
    
    // Update the document
    await this.document.setFlag(MODULE.ID, "bonuses", bonuses);
    
    // Close the sheet
    this.close();
  }

  /**
   * Handle duplicate button clicks.
   * @param {Event} event The click event.
   * @private
   */
  async _onDuplicate(event) {
    // Duplicate the bonus
    const duplicate = api.duplicateBonus(this.bonus);
    
    // Embed the bonus in the document
    await api.embedBonus(this.document, duplicate);
    
    // Close this sheet and open a new one for the duplicate
    this.close();
    const sheet = new BabonusSheet({bonus: duplicate});
    sheet.render(true);
  }

  /**
   * Handle bonus icon clicks.
   * @param {Event} event The click event.
   * @private
   */
  _onBonusIcon(event) {
    // Generate a random color
    const colors = [
      "#4b6eaf", "#af4b4b", "#4baf4b", "#af4baf",
      "#4bafaf", "#afaf4b", "#af7a4b", "#7a4baf"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Update the icon color
    event.currentTarget.style.color = color;
    this.bonus.iconColor = color;
  }

  /** @inheritdoc */
  async _updateObject(event, formData) {
    // Update the bonus with the form data
    foundry.utils.mergeObject(this.bonus, formData);
    
    // Update filters
    for (const [id, filter] of Object.entries(this.activeFilters)) {
      const field = enhancedBonusBuilder.abstract.DataFields.fields[id];
      if (!field) continue;
      
      // Get the filter value from the form data
      const key = `filters.${id}`;
      if (formData[key] !== undefined) {
        this.bonus.filters[id] = formData[key];
      }
    }
    
    // Get the bonuses from the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag(MODULE.ID, "bonuses") || {});
    
    // Update the bonus
    bonuses[this.bonus.id] = this.bonus.toObject();
    
    // Update the document
    await this.document.setFlag(MODULE.ID, "bonuses", bonuses);
    
    // Re-render the sheet
    this.render();
  }
}