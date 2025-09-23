/**
 * Constants used throughout the Enhanced Bonus Builder module
 */

const MODULE = {
  ID: "enhanced-bonus-builder",
  NAME: "Enhanced Bonus Builder",
  TITLE: "ENHANCEDBONUSBUILDER.ModuleTitle",
  ICON: "fa-solid fa-calculator"
};

const SETTINGS = {
  MIGRATE: "migrate",
  SHOW_APPLIED: "showApplied",
  SHOW_OPTIONAL: "showOptional",
  SHOW_SHEET_TAB: "showSheetTab"
};

const BONUS_TYPES = {
  ATTACK_ROLL: "attackRoll",
  DAMAGE_ROLL: "damageRoll",
  SAVING_THROW_DC: "savingThrowDc",
  SAVING_THROW: "savingThrow",
  ABILITY_CHECK: "abilityCheck",
  HIT_DIE: "hitDie"
};

const DAMAGE_TYPES = [
  "acid", "bludgeoning", "cold", "fire", "force", 
  "lightning", "necrotic", "piercing", "poison", 
  "psychic", "radiant", "slashing", "thunder",
  "healing"
];

const SPELL_COMPONENTS = {
  VERBAL: "v",
  SOMATIC: "s",
  MATERIAL: "m"
};

const WEAPON_PROPERTIES = [
  "ada", "amm", "fin", "fir", "foc", "hvy", "lgt", 
  "lod", "mgc", "rch", "rel", "ret", "sil", "spc", 
  "thr", "two", "ver"
];

const ITEM_TYPES = [
  "weapon", "equipment", "consumable", "tool", 
  "loot", "background", "class", "subclass", 
  "spell", "feat", "backpack"
];

const SPELL_SCHOOLS = [
  "abj", "con", "div", "enc", "evo", "ill", "nec", "trs"
];

const ABILITY_TYPES = [
  "str", "dex", "con", "int", "wis", "cha"
];

const SKILL_TYPES = [
  "acr", "ani", "arc", "ath", "dec", "his", 
  "ins", "itm", "inv", "med", "nat", "prc", 
  "prf", "per", "rel", "slt", "ste", "sur"
];

/**
 * Filter system for bonuses.
 */

/**
 * Filter definitions.
 */
const filters = {
  /**
   * Filter by item type.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  itemType: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item) return false;
    
    return filter.includes(item.type);
  },
  
  /**
   * Filter by weapon type.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  weaponType: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "weapon") return false;
    
    return filter.includes(item.system.weaponType);
  },
  
  /**
   * Filter by weapon properties.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  weaponProperties: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "weapon") return false;
    
    const properties = item.system.properties || {};
    
    for (const property of filter) {
      if (!properties[property]) return false;
    }
    
    return true;
  },
  
  /**
   * Filter by armor type.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  armorType: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "equipment" || !item.system.armor) return false;
    
    return filter.includes(item.system.armor.type);
  },
  
  /**
   * Filter by spell level.
   * @param {Babonus} bonus The bonus to check.
   * @param {object} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  spellLevel: (bonus, filter, context) => {
    if (!filter) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const level = item.system.level;
    
    if (filter.min !== undefined && level < filter.min) return false;
    if (filter.max !== undefined && level > filter.max) return false;
    
    return true;
  },
  
  /**
   * Filter by spell school.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  spellSchool: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    return filter.includes(item.system.school);
  },
  
  /**
   * Filter by spell components.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  spellComponents: (bonus, filter, context) => {
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
  },
  
  /**
   * Filter by damage types.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  damageTypes: (bonus, filter, context) => {
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
  },
  
  /**
   * Filter by abilities.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  abilities: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const ability = context.ability;
    if (!ability) return false;
    
    return filter.includes(ability);
  },
  
  /**
   * Filter by skills.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  skills: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const skill = context.skill;
    if (!skill) return false;
    
    return filter.includes(skill);
  },
  
  /**
   * Filter by proficiency.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  proficiency: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const { actor, item } = context;
    if (!actor || !item) return false;
    
    let hasProficiency = false;
    
    if (item.type === "weapon") {
      hasProficiency = enhancedBonusBuilder.api.hasWeaponProficiency(actor, item);
    } else if (item.type === "equipment" && item.system.armor) {
      hasProficiency = enhancedBonusBuilder.api.hasArmorProficiency(actor, item);
    } else if (item.type === "tool") {
      hasProficiency = enhancedBonusBuilder.api.hasToolProficiency(actor, item);
    }
    
    return filter === hasProficiency;
  },
  
  /**
   * Filter by markers.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  markers: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const { actor, target } = context;
    if (!actor) return false;
    
    // Check actor markers
    const actorMarkers = actor.getFlag("enhanced-bonus-builder", "markers") || [];
    const hasAllActorMarkers = filter.every(m => actorMarkers.includes(m));
    if (hasAllActorMarkers) return true;
    
    // Check target markers if available
    if (target) {
      const targetMarkers = target.getFlag("enhanced-bonus-builder", "markers") || [];
      const hasAllTargetMarkers = filter.every(m => targetMarkers.includes(m));
      if (hasAllTargetMarkers) return true;
    }
    
    return false;
  },
  
  /**
   * Filter by conditions.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  conditions: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const { actor, target } = context;
    if (!actor) return false;
    
    // Check actor conditions
    for (const condition of filter) {
      if (actor.effects.some(e => e.statuses.has(condition))) return true;
    }
    
    // Check target conditions if available
    if (target) {
      for (const condition of filter) {
        if (target.effects.some(e => e.statuses.has(condition))) return true;
      }
    }
    
    return false;
  },
  
  /**
   * Filter by distance.
   * @param {Babonus} bonus The bonus to check.
   * @param {object} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  distance: (bonus, filter, context) => {
    if (!filter) return true;
    
    const { actor, target } = context;
    if (!actor || !target || !actor.token || !target.token) return false;
    
    const distance = canvas.grid.measureDistance(actor.token, target.token);
    
    if (filter.min !== undefined && distance < filter.min) return false;
    if (filter.max !== undefined && distance > filter.max) return false;
    
    return true;
  },
  
  /**
   * Filter by equipped status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  equipped: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item) return false;
    
    const isEquipped = item.system.equipped === true;
    return filter === isEquipped;
  },
  
  /**
   * Filter by attunement status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  attunement: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item) return false;
    
    const isAttuned = item.system.attunement === 2; // 2 = attuned
    return filter === isAttuned;
  },
  
  /**
   * Filter by prepared status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  prepared: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const isPrepared = item.system.preparation?.prepared === true;
    return filter === isPrepared;
  },
  
  /**
   * Filter by concentration status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  concentration: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const isConcentration = item.system.components?.concentration === true;
    return filter === isConcentration;
  },
  
  /**
   * Filter by ritual status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  ritual: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const isRitual = item.system.components?.ritual === true;
    return filter === isRitual;
  },
  
  /**
   * Filter by critical hit status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  critical: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const isCritical = context.critical === true;
    return filter === isCritical;
  }
};

/**
 * The application for editing a bonus.
 */
class BabonusSheet extends FormApplication {
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

/**
 * The application for creating new bonuses.
 */
class BabonusWorkshop extends Application {
  /**
   * @param {Document} document The document to create bonuses for.
   * @param {object} options Application options.
   */
  constructor(document, options = {}) {
    super(options);
    this.document = document;
    this.isNew = true;
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["enhanced-bonus-builder", "workshop"],
      template: MODULE.TEMPLATES.WORKSHOP,
      width: 600,
      height: 400,
      resizable: true
    });
  }

  /** @inheritdoc */
  get title() {
    return `${game.i18n.localize("ENHANCEDBONUSBUILDER.ModuleTitle")}: ${game.i18n.localize("New")}`;
  }

  /** @inheritdoc */
  getData() {
    const data = super.getData();
    
    // Add document data
    data.parentName = this.document.name;
    data.isNew = this.isNew;
    data.iconColor = "#4b6eaf";
    
    // Add bonus types
    data.bonusTypes = {};
    data.icons = {};
    
    for (const type of Object.values(BONUS_TYPES)) {
      data.bonusTypes[type] = `ENHANCEDBONUSBUILDER.BonusTypes.${type}`;
      
      // Set icons for each type
      switch (type) {
        case "attackRoll":
          data.icons[type] = "dice-d20";
          break;
        case "damageRoll":
          data.icons[type] = "fire";
          break;
        case "savingThrowDc":
          data.icons[type] = "shield";
          break;
        case "savingThrow":
          data.icons[type] = "shield-alt";
          break;
        case "abilityCheck":
          data.icons[type] = "check";
          break;
        case "hitDie":
          data.icons[type] = "heart";
          break;
        default:
          data.icons[type] = "calculator";
      }
    }
    
    return data;
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    
    // Handle bonus type selection
    html.find('.bonus-type').click(this._onBonusTypeClick.bind(this));
    
    // Handle bonus icon
    html.find('[data-action="bonus-icon"]').click(this._onBonusIcon.bind(this));
  }

  /**
   * Handle bonus type clicks.
   * @param {Event} event The click event.
   * @private
   */
  async _onBonusTypeClick(event) {
    const type = event.currentTarget.dataset.type;
    
    // Create a new bonus of the selected type
    const bonus = api.createBonus(this.document, type);
    
    // Embed the bonus in the document
    await api.embedBonus(this.document, bonus);
    
    // Close this workshop and open a sheet for the new bonus
    this.close();
    const sheet = new BabonusSheet({bonus});
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
    this.iconColor = color;
    
    // Re-render
    this.render();
  }
}

/**
 * A collection of bonuses for a document.
 */
class BonusCollection {
  /**
   * @param {Document} document The document to collect bonuses for.
   */
  constructor(document) {
    this.document = document;
    this.bonuses = [];
    this._initialize();
  }

  /**
   * Initialize the collection.
   * @private
   */
  _initialize() {
    const bonuses = this.document.getFlag("enhanced-bonus-builder", "bonuses") || {};
    
    for (const [id, data] of Object.entries(bonuses)) {
      const Model = enhancedBonusBuilder.abstract.DataModels[data.type];
      if (!Model) continue;
      
      const bonus = new Model(data, {parent: this.document});
      this.bonuses.push(bonus);
    }
    
    // Sort bonuses by sort order
    this.bonuses.sort((a, b) => a.sort - b.sort);
  }

  /**
   * Get all bonuses in the collection.
   * @returns {Array<Babonus>} The bonuses.
   */
  getAll() {
    return [...this.bonuses];
  }

  /**
   * Get bonuses of a specific type.
   * @param {string} type The type of bonuses to get.
   * @returns {Array<Babonus>} The bonuses of the specified type.
   */
  getByType(type) {
    return this.bonuses.filter(b => b.type === type);
  }

  /**
   * Get enabled bonuses.
   * @returns {Array<Babonus>} The enabled bonuses.
   */
  getEnabled() {
    return this.bonuses.filter(b => b.enabled);
  }

  /**
   * Get optional bonuses.
   * @returns {Array<Babonus>} The optional bonuses.
   */
  getOptional() {
    return this.bonuses.filter(b => b.optional);
  }

  /**
   * Get bonuses that apply to a specific context.
   * @param {object} context The context to check against.
   * @returns {Promise<Array<Babonus>>} The applicable bonuses.
   */
  async getApplicable(context) {
    const applicable = [];
    
    for (const bonus of this.bonuses) {
      if (await bonus.applies(context)) {
        applicable.push(bonus);
      }
    }
    
    return applicable;
  }

  /**
   * Add a bonus to the collection.
   * @param {Babonus} bonus The bonus to add.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async add(bonus) {
    // Add the bonus to the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag("enhanced-bonus-builder", "bonuses") || {});
    bonuses[bonus.id] = bonus.toObject();
    await this.document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
    
    // Add the bonus to the collection
    this.bonuses.push(bonus);
    
    return this;
  }

  /**
   * Remove a bonus from the collection.
   * @param {string} id The ID of the bonus to remove.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async remove(id) {
    // Remove the bonus from the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag("enhanced-bonus-builder", "bonuses") || {});
    delete bonuses[id];
    await this.document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
    
    // Remove the bonus from the collection
    this.bonuses = this.bonuses.filter(b => b.id !== id);
    
    return this;
  }

  /**
   * Update a bonus in the collection.
   * @param {Babonus} bonus The bonus to update.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async update(bonus) {
    // Update the bonus in the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag("enhanced-bonus-builder", "bonuses") || {});
    bonuses[bonus.id] = bonus.toObject();
    await this.document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
    
    // Update the bonus in the collection
    const index = this.bonuses.findIndex(b => b.id === bonus.id);
    if (index !== -1) {
      this.bonuses[index] = bonus;
    }
    
    return this;
  }

  /**
   * Clear all bonuses from the collection.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async clear() {
    // Clear the bonuses from the document
    await this.document.unsetFlag("enhanced-bonus-builder", "bonuses");
    
    // Clear the bonuses from the collection
    this.bonuses = [];
    
    return this;
  }
}

/**
 * Registry for tracking rolls and collecting applicable bonuses.
 */
class Registry {
  constructor() {
    this.registry = new Map();
  }

  /**
   * Register a roll for bonus collection.
   * @param {object} data The roll data.
   * @returns {string} The registry ID.
   */
  register(data) {
    const id = foundry.utils.randomID();
    this.registry.set(id, data);
    
    // Clean up old entries after 5 minutes
    setTimeout(() => this.registry.delete(id), 300000);
    
    return id;
  }

  /**
   * Get a registered roll.
   * @param {string} id The registry ID.
   * @returns {object|undefined} The roll data.
   */
  get(id) {
    return this.registry.get(id);
  }

  /**
   * Collect bonuses for a roll.
   * @param {string} type The type of roll.
   * @param {object} context The roll context.
   * @returns {Promise<Array>} The applicable bonuses.
   */
  async collect(type, context) {
    const { actor } = context;
    if (!actor) return [];
    
    const bonuses = [];
    
    // Get all documents with bonuses
    const documents = api.findEmbeddedDocumentsWithBonuses(actor);
    
    // Check each document for applicable bonuses
    for (const document of documents) {
      const documentBonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
      
      for (const [id, data] of Object.entries(documentBonuses)) {
        // Skip bonuses of the wrong type
        if (data.type !== type) continue;
        
        // Skip disabled bonuses
        if (!data.enabled) continue;
        
        // Create the bonus model
        const Model = enhancedBonusBuilder.abstract.DataModels[data.type];
        if (!Model) continue;
        
        const bonus = new Model(data, { parent: document });
        
        // Check if the bonus applies
        if (await bonus.applies(context)) {
          bonuses.push(bonus);
        }
      }
    }
    
    // Check for aura bonuses from other actors
    await this._collectAuraBonuses(bonuses, type, context);
    
    return bonuses;
  }

  /**
   * Collect aura bonuses from other actors.
   * @param {Array} bonuses The array to add bonuses to.
   * @param {string} type The type of roll.
   * @param {object} context The roll context.
   * @returns {Promise<void>}
   * @private
   */
  async _collectAuraBonuses(bonuses, type, context) {
    const { actor } = context;
    if (!actor || !actor.token) return;
    
    const sourceToken = actor.token;
    if (!sourceToken) return;
    
    // Get all tokens on the canvas
    const tokens = canvas.tokens.placeables;
    
    // Check each token for aura bonuses
    for (const token of tokens) {
      if (!token.actor) continue;
      
      // Skip the source token
      if (token.id === sourceToken.id) continue;
      
      // Get all documents with bonuses
      const documents = api.findEmbeddedDocumentsWithBonuses(token.actor);
      
      // Check each document for applicable aura bonuses
      for (const document of documents) {
        const documentBonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
        
        for (const [id, data] of Object.entries(documentBonuses)) {
          // Skip bonuses of the wrong type
          if (data.type !== type) continue;
          
          // Skip disabled bonuses
          if (!data.enabled) continue;
          
          // Skip non-aura bonuses
          if (!data.aura?.enabled) continue;
          
          // Create the bonus model
          const Model = enhancedBonusBuilder.abstract.DataModels[data.type];
          if (!Model) continue;
          
          const bonus = new Model(data, { parent: document });
          
          // Check if the aura applies
          if (bonus.aura.applies(token, sourceToken)) {
            // Check if the bonus applies
            if (await bonus.applies(context)) {
              bonuses.push(bonus);
            }
          }
        }
      }
    }
  }
}

var registry = new Registry();

/**
 * A dialog for selecting optional bonuses.
 */
class OptionalSelector extends Application {
  /**
   * @param {object} options The options for the dialog.
   * @param {Dialog} options.dialog The dialog to attach to.
   * @param {object} options.registry The registry entry.
   * @param {string} options.type The type of roll.
   * @param {object} options.options The roll options.
   */
  constructor(options) {
    super();
    this.dialog = options.dialog;
    this.registry = options.registry;
    this.type = options.type;
    this.options = options.options;
    this.bonuses = [];
    this.selected = new Set();
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["enhanced-bonus-builder", "optional-selector"],
      template: MODULE.TEMPLATES.OPTIONAL_BONUSES,
      width: 400,
      height: "auto",
      resizable: false
    });
  }

  /** @inheritdoc */
  get title() {
    return game.i18n.localize("ENHANCEDBONUSBUILDER.OptionalBonuses");
  }

  /** @inheritdoc */
  async getData() {
    const data = super.getData();
    
    // Get optional bonuses
    const { actor } = this.options;
    if (!actor) return data;
    
    // Get all documents with bonuses
    const documents = enhancedBonusBuilder.api.findEmbeddedDocumentsWithBonuses(actor);
    
    // Check each document for applicable optional bonuses
    for (const document of documents) {
      const documentBonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
      
      for (const [id, bonusData] of Object.entries(documentBonuses)) {
        // Skip bonuses of the wrong type
        if (bonusData.type !== this.type) continue;
        
        // Skip non-optional bonuses
        if (!bonusData.optional) continue;
        
        // Skip disabled bonuses
        if (!bonusData.enabled) continue;
        
        // Create the bonus model
        const Model = enhancedBonusBuilder.abstract.DataModels[bonusData.type];
        if (!Model) continue;
        
        const bonus = new Model(bonusData, { parent: document });
        
        // Check if the bonus applies
        if (await bonus.applies(this.registry)) {
          this.bonuses.push(bonus);
        }
      }
    }
    
    // Add bonuses to data
    data.bonuses = this.bonuses;
    data.selected = this.selected;
    
    // Evaluate bonus values
    data.values = {};
    for (const bonus of this.bonuses) {
      try {
        data.values[bonus.id] = await bonus.evaluateBonus();
      } catch (error) {
        console.error("Enhanced Bonus Builder | Error evaluating optional bonus:", error);
        data.values[bonus.id] = 0;
      }
    }
    
    return data;
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    
    // Handle bonus toggle
    html.find('.bonus-toggle').change(this._onBonusToggle.bind(this));
    
    // Handle apply button
    html.find('[data-action="apply"]').click(this._onApply.bind(this));
    
    // Handle cancel button
    html.find('[data-action="cancel"]').click(this._onCancel.bind(this));
  }

  /**
   * Handle bonus toggle.
   * @param {Event} event The change event.
   * @private
   */
  _onBonusToggle(event) {
    const bonusId = event.currentTarget.dataset.id;
    
    if (event.currentTarget.checked) {
      this.selected.add(bonusId);
    } else {
      this.selected.delete(bonusId);
    }
  }

  /**
   * Handle apply button.
   * @param {Event} event The click event.
   * @private
   */
  async _onApply(event) {
    // Store selected bonuses in the registry
    this.registry.optionalBonuses = Array.from(this.selected).map(id => {
      return this.bonuses.find(b => b.id === id);
    }).filter(Boolean);
    
    // Close the dialog
    this.close();
    
    // Continue with the roll
    const button = this.dialog.element.find('button[data-button="ok"]');
    if (button.length) {
      button.trigger('click');
    }
  }

  /**
   * Handle cancel button.
   * @param {Event} event The click event.
   * @private
   */
  _onCancel(event) {
    // Close the dialog
    this.close();
  }

  /** @inheritdoc */
  async _render(force = false, options = {}) {
    // Only render if there are optional bonuses and the setting is enabled
    const showOptional = game.settings.get(MODULE.ID, SETTINGS.SHOW_OPTIONAL);
    if (!showOptional || this.bonuses.length === 0) {
      return this;
    }
    
    return super._render(force, options);
  }

  /** @inheritdoc */
  setPosition(options = {}) {
    // Position below the dialog
    if (this.dialog?.element) {
      const dialogRect = this.dialog.element[0].getBoundingClientRect();
      options.left = dialogRect.left;
      options.top = dialogRect.bottom + 5;
    }
    
    return super.setPosition(options);
  }
}

var applications = {
  BabonusSheet,
  BabonusWorkshop,
  BonusCollection,
  OptionalSelector
};

/**
 * Base class for all filter fields.
 */
class BaseField {
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

/**
 * Filter for item types.
 */
class ItemTypeField extends BaseField {
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

class WeaponTypeField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.weaponType.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.weaponType.hint",
      choices: {
        simpleM: "DND5E.WeaponSimpleM",
        simpleR: "DND5E.WeaponSimpleR",
        martialM: "DND5E.WeaponMartialM",
        martialR: "DND5E.WeaponMartialR",
        natural: "DND5E.WeaponNatural",
        improvised: "DND5E.WeaponImprovised"
      },
      ...options
    });
  }
}

class WeaponPropertiesField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      choices: WEAPON_PROPERTIES.reduce((obj, wp) => {
        obj[wp] = `ENHANCEDBONUSBUILDER.WEAPONPROPERTIES.${wp}`;
        return obj;
      }, {}),
      label: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.hint",
      ...options
    });
  }
}

class ArmorTypeField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.armorType.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.armorType.hint",
      choices: {
        light: "DND5E.ArmorLight",
        medium: "DND5E.ArmorMedium",
        heavy: "DND5E.ArmorHeavy",
        shield: "DND5E.EquipmentShield"
      },
      ...options
    });
  }
}

class SpellLevelField extends foundry.data.fields.NumberField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.spellLevel.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.spellLevel.hint",
      min: 0,
      max: 9,
      step: 1,
      ...options
    });
  }
}

class SpellSchoolField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.spellSchool.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.spellSchool.hint",
      choices: SPELL_SCHOOLS.reduce((obj, school) => {
        obj[school] = `DND5E.SpellSchool${school.capitalize()}`;
        return obj;
      }, {}),
      ...options
    });
  }
}

/**
 * Filter for spell components.
 */
class SpellComponentsField extends BaseField {
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

/**
 * Filter for damage types.
 */
class DamageTypesField extends BaseField {
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

class AbilitiesField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      choices: ABILITY_TYPES.reduce((obj, ability) => {
        obj[ability] = `DND5E.Ability${ability.capitalize()}`;
        return obj;
      }, {}),
      label: "ENHANCEDBONUSBUILDER.FIELDS.abilities.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.abilities.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.abilities.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.abilities.hint",
      ...options
    });
  }
}

class SkillsField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      choices: SKILL_TYPES.reduce((obj, skill) => {
        obj[skill] = `DND5E.Skill${skill.capitalize()}`;
        return obj;
      }, {}),
      label: "ENHANCEDBONUSBUILDER.FIELDS.skills.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.skills.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.skills.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.skills.hint",
      ...options
    });
  }
}

class ProficiencyField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.proficiency.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.proficiency.hint",
      choices: {
        proficient: "DND5E.ProficiencyLevel1",
        expert: "DND5E.ProficiencyLevel2"
      },
      ...options
    });
  }
}

class MarkersField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      label: "ENHANCEDBONUSBUILDER.FIELDS.markers.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.markers.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.markers.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.markers.hint",
      ...options
    });
  }
}

class ConditionsField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.conditions.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.conditions.hint`,
      ...options
    });
  }
}

class DistanceField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.distance.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.distance.hint`,
      ...options
    });
  }
}

class EquippedField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.equipped.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.equipped.hint`,
      ...options
    });
  }
}

class AttunementField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.attunement.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.attunement.hint`,
      ...options
    });
  }
}

class PreparedField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.prepared.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.prepared.hint`,
      ...options
    });
  }
}

class ConcentrationField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.concentration.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.concentration.hint`,
      ...options
    });
  }
}

class RitualField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.ritual.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.ritual.hint`,
      ...options
    });
  }
}

class CriticalField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.critical.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.critical.hint`,
      ...options
    });
  }
}

var fields = {
  itemType: new ItemTypeField(),
  weaponType: new WeaponTypeField(),
  weaponProperties: new WeaponPropertiesField(),
  armorType: new ArmorTypeField(),
  spellLevel: new SpellLevelField(),
  spellSchool: new SpellSchoolField(),
  spellComponents: new SpellComponentsField(),
  damageTypes: new DamageTypesField(),
  abilities: new AbilitiesField(),
  skills: new SkillsField(),
  proficiency: new ProficiencyField(),
  markers: new MarkersField(),
  conditions: new ConditionsField(),
  distance: new DistanceField(),
  equipped: new EquippedField(),
  attunement: new AttunementField(),
  prepared: new PreparedField(),
  concentration: new ConcentrationField(),
  ritual: new RitualField(),
  critical: new CriticalField()
};

/**
 * Model for aura properties of a bonus.
 */

const { BooleanField: BooleanField$3, NumberField: NumberField$1, SchemaField: SchemaField$2, SetField: SetField$1, StringField: StringField$3 } = foundry.data.fields;

/**
 * Configuration for the aura properties of a bonus.
 */
class AuraModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      enabled: new BooleanField$3({initial: false}),
      template: new BooleanField$3({initial: false}),
      range: new StringField$3({initial: "30"}),
      self: new BooleanField$3({initial: false}),
      disposition: new NumberField$1({initial: 0, integer: true, choices: [-1, 0, 1]}),
      blockers: new SetField$1(new StringField$3()),
      require: new SchemaField$2({
        move: new BooleanField$3({initial: false}),
        sight: new BooleanField$3({initial: false})
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

/**
 * Model for consumption properties of a bonus.
 */

const { BooleanField: BooleanField$2, NumberField, SchemaField: SchemaField$1, StringField: StringField$2 } = foundry.data.fields;

/**
 * Configuration for how a bonus consumes a property.
 */
class ConsumptionModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      enabled: new BooleanField$2({initial: false}),
      scales: new BooleanField$2({initial: false}),
      type: new StringField$2({
        choices: [
          "attributes", "currency", "resources", "uses", "charges", "slots", "hitDice"
        ]
      }),
      value: new SchemaField$1({
        min: new StringField$2({initial: "1"}),
        max: new StringField$2({initial: "1"}),
        step: new NumberField({initial: 1, integer: true, min: 1})
      }),
      formula: new StringField$2({initial: "@consumption"})
    };
  }

  /**
   * Get the available consumption types for a given document.
   * @param {Document} document The document to check.
   * @returns {object} The available consumption types.
   */
  static getAvailableTypes(document) {
    const types = {};
    
    // Actor-specific consumption types
    if (document.documentName === "Actor") {
      types.attributes = "ENHANCEDBONUSBUILDER.ConsumptionTypes.attributes";
      types.currency = "ENHANCEDBONUSBUILDER.ConsumptionTypes.currency";
      types.resources = "ENHANCEDBONUSBUILDER.ConsumptionTypes.resources";
      types.hitDice = "ENHANCEDBONUSBUILDER.ConsumptionTypes.hitDice";
    }
    
    // Item-specific consumption types
    if (document.documentName === "Item") {
      if (document.system.uses?.max) {
        types.uses = "ENHANCEDBONUSBUILDER.ConsumptionTypes.uses";
      }
      if (document.system.consume?.type === "charges") {
        types.charges = "ENHANCEDBONUSBUILDER.ConsumptionTypes.charges";
      }
      if (document.type === "spell") {
        types.slots = "ENHANCEDBONUSBUILDER.ConsumptionTypes.slots";
      }
    }
    
    return types;
  }

  /**
   * Get the available properties for a given consumption type and document.
   * @param {string} type The consumption type.
   * @param {Document} document The document to check.
   * @returns {object} The available properties.
   */
  static getAvailableProperties(type, document) {
    const properties = {};
    
    switch (type) {
      case "attributes":
        if (document.documentName === "Actor") {
          for (const [key, attr] of Object.entries(document.system.attributes)) {
            if (typeof attr === "object" && attr !== null && "value" in attr) {
              properties[key] = key;
            }
          }
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          for (const [key, value] of Object.entries(document.system.currency)) {
            if (typeof value === "number") {
              properties[key] = key;
            }
          }
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          for (const [key, res] of Object.entries(document.system.resources)) {
            if (typeof res === "object" && res !== null && "value" in res) {
              properties[key] = key;
            }
          }
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          for (const [key, cls] of Object.entries(document.classes)) {
            properties[key] = cls.name;
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          properties.uses = "uses";
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          properties.charges = "charges";
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          for (let i = 1; i <= 9; i++) {
            properties[i] = `Level ${i}`;
          }
        }
        break;
    }
    
    return properties;
  }

  /**
   * Consume the property.
   * @param {Document} document The document to consume from.
   * @param {string} property The property to consume.
   * @param {number} amount The amount to consume.
   * @returns {Promise<Document>} The updated document.
   */
  async consume(document, property, amount) {
    const updates = {};
    
    switch (this.type) {
      case "attributes":
        if (document.documentName === "Actor") {
          updates[`system.attributes.${property}.value`] = Math.max(0, document.system.attributes[property].value - amount);
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          updates[`system.currency.${property}`] = Math.max(0, document.system.currency[property] - amount);
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          updates[`system.resources.${property}.value`] = Math.max(0, document.system.resources[property].value - amount);
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          const cls = document.classes[property];
          if (cls) {
            updates[`system.classes.${property}.hitDiceUsed`] = Math.min(
              cls.system.levels,
              cls.system.hitDiceUsed + amount
            );
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          updates["system.uses.value"] = Math.max(0, document.system.uses.value - amount);
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          const target = document.system.consume.target;
          const item = document.actor.items.get(target);
          if (item) {
            await item.update({
              "system.uses.value": Math.max(0, item.system.uses.value - amount)
            });
          }
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          const level = parseInt(property);
          if (!isNaN(level) && document.actor) {
            const spells = document.actor.system.spells;
            if (spells[`spell${level}`]) {
              updates[`system.spells.spell${level}.value`] = Math.max(
                0,
                spells[`spell${level}`].value - amount
              );
            }
          }
        }
        break;
    }
    
    if (Object.keys(updates).length > 0) {
      return document.update(updates);
    }
    
    return document;
  }

  /**
   * Get the current value of the property.
   * @param {Document} document The document to check.
   * @param {string} property The property to check.
   * @returns {number} The current value.
   */
  getCurrentValue(document, property) {
    switch (this.type) {
      case "attributes":
        if (document.documentName === "Actor") {
          return document.system.attributes[property]?.value ?? 0;
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          return document.system.currency[property] ?? 0;
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          return document.system.resources[property]?.value ?? 0;
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          const cls = document.classes[property];
          if (cls) {
            return cls.system.levels - cls.system.hitDiceUsed;
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          return document.system.uses.value;
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          const target = document.system.consume.target;
          const item = document.actor.items.get(target);
          if (item) {
            return item.system.uses.value;
          }
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          const level = parseInt(property);
          if (!isNaN(level) && document.actor) {
            const spells = document.actor.system.spells;
            if (spells[`spell${level}`]) {
              return spells[`spell${level}`].value;
            }
          }
        }
        break;
    }
    
    return 0;
  }

  /**
   * Get the maximum value of the property.
   * @param {Document} document The document to check.
   * @param {string} property The property to check.
   * @returns {number} The maximum value.
   */
  getMaxValue(document, property) {
    switch (this.type) {
      case "attributes":
        if (document.documentName === "Actor") {
          return document.system.attributes[property]?.max ?? 0;
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          return Infinity;
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          return document.system.resources[property]?.max ?? 0;
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          const cls = document.classes[property];
          if (cls) {
            return cls.system.levels;
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          return document.system.uses.max;
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          const target = document.system.consume.target;
          const item = document.actor.items.get(target);
          if (item) {
            return item.system.uses.max;
          }
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          const level = parseInt(property);
          if (!isNaN(level) && document.actor) {
            const spells = document.actor.system.spells;
            if (spells[`spell${level}`]) {
              return spells[`spell${level}`].max;
            }
          }
        }
        break;
    }
    
    return 0;
  }
}

/**
 * Model for modifiers properties of a bonus.
 */

const { BooleanField: BooleanField$1, StringField: StringField$1 } = foundry.data.fields;

/**
 * Configuration for the modifiers of a bonus.
 */
class ModifiersModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      enabled: new BooleanField$1({initial: false}),
      formula: new StringField$1({initial: ""}),
      target: new StringField$1({
        choices: ["actor", "item", "roll", "target"]
      }),
      mode: new StringField$1({
        choices: ["add", "multiply", "override", "upgrade", "downgrade"]
      }),
      priority: new StringField$1({
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

const {
  BooleanField, DocumentIdField, EmbeddedDataField,
  FilePathField, HTMLField, IntegerSortField,
  ObjectField, SchemaField, SetField, StringField
} = foundry.data.fields;

/**
 * Configuration for how a bonus consumes a property.
 *
 * @typedef {object} ConsumptionModel
 * @property {boolean} enabled Whether the bonus consumes a property.
 * @property {boolean} scales Whether the bonus scales with its consumed property
 * @property {string} type The type of the consumed property.
 * @property {object} value
 * @property {string} value.min The minimum amount the bonus consumes
 * @property {string} value.max The maximum amount the bonus consumes
 * @property {number} value.step The interval size between the min and max
 * @property {string} formula The formula used to scale up the bonus.
 */

/**
 * Configuration for the aura properties of a bonus.
 *
 * @typedef {object} AuraModel
 * @property {boolean} enabled Whether the bonus is an aura
 * @property {boolean} template Whether the bonus is an aura on a template.
 * @property {string} range The range of the aura.
 * @property {boolean} self Whether the aura can also affect its owner
 * @property {number} disposition The type of actors, by token disposition, to affect with the aura.
 * @property {Set<string>} blockers Statuses that disable this aura when its owner is affected.
 * @property {object} require
 * @property {boolean} require.move Whether the aura requires a direct, unobstructed path of movement.
 * @property {boolean} require.sight Whether the aura requires a direct line of sight.
 */

/**
 * Configuration for the modifiers of a bonus.
 *
 * @typedef {object} ModifiersModel
 * @property {boolean} enabled Whether the bonus has modifiers.
 * @property {string} formula The formula used to calculate the modifier.
 * @property {string} target The target of the modifier.
 * @property {string} mode The mode of the modifier.
 * @property {string} priority The priority of the modifier.
 */

/**
 * The base data model for a bonus.
 */
class Babonus extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      id: new DocumentIdField({required: true}),
      name: new StringField({required: true, blank: false}),
      img: new FilePathField({required: true, categories: ["IMAGE"], initial: "icons/svg/upgrade.svg"}),
      type: new StringField({required: true, choices: [
        "attackRoll", "damageRoll", "savingThrowDc", "savingThrow", "abilityCheck", "hitDie"
      ]}),
      description: new HTMLField(),
      bonus: new StringField({required: true, blank: false, initial: "1"}),
      enabled: new BooleanField({initial: true}),
      optional: new BooleanField(),
      consumption: new EmbeddedDataField(ConsumptionModel),
      aura: new EmbeddedDataField(AuraModel),
      modifiers: new EmbeddedDataField(ModifiersModel),
      filters: new ObjectField(),
      sort: new IntegerSortField()
    };
  }

  /**
   * Get the parent document that owns this bonus.
   * @returns {Document} The parent document.
   */
  get parent() {
    return this._parent;
  }

  /**
   * Get the UUID of the parent document.
   * @returns {string} The UUID of the parent document.
   */
  get parentUuid() {
    return this.parent.uuid;
  }

  /**
   * Get the actor that owns this bonus.
   * @returns {Actor|null} The actor, or null if not owned by an actor.
   */
  get actor() {
    return this.parent.documentName === "Actor" ? this.parent : this.parent.actor;
  }

  /**
   * Get the UUID of the actor that owns this bonus.
   * @returns {string|null} The UUID of the actor, or null if not owned by an actor.
   */
  get actorUuid() {
    return this.actor?.uuid ?? null;
  }

  /**
   * Get the item that owns this bonus.
   * @returns {Item|null} The item, or null if not owned by an item.
   */
  get item() {
    return this.parent.documentName === "Item" ? this.parent : null;
  }

  /**
   * Get the UUID of the item that owns this bonus.
   * @returns {string|null} The UUID of the item, or null if not owned by an item.
   */
  get itemUuid() {
    return this.item?.uuid ?? null;
  }

  /**
   * Get the effect that owns this bonus.
   * @returns {ActiveEffect|null} The effect, or null if not owned by an effect.
   */
  get effect() {
    return this.parent.documentName === "ActiveEffect" ? this.parent : null;
  }

  /**
   * Get the UUID of the effect that owns this bonus.
   * @returns {string|null} The UUID of the effect, or null if not owned by an effect.
   */
  get effectUuid() {
    return this.effect?.uuid ?? null;
  }

  /**
   * Get the region that owns this bonus.
   * @returns {RegionConfig|null} The region, or null if not owned by a region.
   */
  get region() {
    return this.parent.documentName === "RegionConfig" ? this.parent : null;
  }

  /**
   * Get the UUID of the region that owns this bonus.
   * @returns {string|null} The UUID of the region, or null if not owned by a region.
   */
  get regionUuid() {
    return this.region?.uuid ?? null;
  }

  /**
   * Get the roll data for this bonus.
   * @returns {object} The roll data.
   */
  getRollData() {
    const rollData = {};
    if (this.actor) foundry.utils.mergeObject(rollData, this.actor.getRollData());
    if (this.item) rollData.item = this.item.toObject();
    return rollData;
  }

  /**
   * Evaluate the bonus formula.
   * @param {object} [data={}] Additional data to include in the roll data.
   * @returns {number} The evaluated bonus.
   */
  async evaluateBonus(data = {}) {
    const rollData = foundry.utils.mergeObject(this.getRollData(), data);
    const roll = await new Roll(this.bonus, rollData).evaluate({async: true});
    return roll.total;
  }

  /**
   * Check if this bonus applies to a given context.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the bonus applies.
   */
  async applies(context) {
    // Check if the bonus is enabled
    if (!this.enabled) return false;

    // Check filters
    for (const [id, filter] of Object.entries(this.filters)) {
      const field = fields[id];
      if (!field) continue;
      if (!await field.applies(this, filter, context)) return false;
    }

    return true;
  }
}

/**
 * Data models for different types of bonuses.
 */
var BabonusModels = {
  attackRoll: class AttackRollBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        // Add attack roll specific fields here
      });
    }
  },
  damageRoll: class DamageRollBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        damageType: new StringField({choices: [
          "acid", "bludgeoning", "cold", "fire", "force", 
          "lightning", "necrotic", "piercing", "poison", 
          "psychic", "radiant", "slashing", "thunder",
          "healing"
        ]}),
        critical: new BooleanField()
      });
    }
  },
  savingThrowDc: class SavingThrowDcBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        // Add saving throw DC specific fields here
      });
    }
  },
  savingThrow: class SavingThrowBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        ability: new SetField(new StringField({choices: ["str", "dex", "con", "int", "wis", "cha"]}))
      });
    }
  },
  abilityCheck: class AbilityCheckBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        ability: new SetField(new StringField({choices: ["str", "dex", "con", "int", "wis", "cha"]})),
        skill: new SetField(new StringField({choices: [
          "acr", "ani", "arc", "ath", "dec", "his", 
          "ins", "itm", "inv", "med", "nat", "prc", 
          "prf", "per", "rel", "slt", "ste", "sur"
        ]}))
      });
    }
  },
  hitDie: class HitDieBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        // Add hit die specific fields here
      });
    }
  }
};

var models = {
  Babonus,
  ...BabonusModels,
  AuraModel,
  ConsumptionModel,
  ModifiersModel
};

var api = {
  applyMarkers: applyMarkers,
  createBonus: createBonus,
  duplicateBonus: duplicateBonus,
  embedBonus: embedBonus,
  findEmbeddedDocumentsWithBonuses: findEmbeddedDocumentsWithBonuses,
  fromUuid: bonusFromUuid,
  fromUuidSync: bonusFromUuidSync,
  getCollection: getCollection,
  hasArmorProficiency: hasArmorProficiency,
  hasToolProficiency: hasToolProficiency,
  hasWeaponProficiency: hasWeaponProficiency,
  hotbarToggle: hotbarToggle,
  openBonusWorkshop: openBonusWorkshop,
  openBonusWorkshopForActor: openBonusWorkshopForActor,
  proficiencyTree: proficiencyTree,
  speaksLanguage: speaksLanguage
};

/**
 * Apply markers to a document for the 'Markers' filter
 * @param {Document} document The target document.
 * @returns {Promise<Document|null>} A promise that resolves to the result of the dialog prompt.
 */
async function applyMarkers(document) {
  const { SetField, StringField } = foundry.data.fields;
  const field = new SetField(new StringField());
  const value = document.getFlag("enhanced-bonus-builder", "markers") ?? [];
  const html = field.toFormGroup({
    label: "ENHANCEDBONUSBUILDER.MarkersDialog.field.label",
    hint: "ENHANCEDBONUSBUILDER.MarkersDialog.field.hint",
    localize: true
  }, {value: value, name: "markers", slug: true}).outerHTML;

  return foundry.applications.api.DialogV2.prompt({
    rejectClose: false,
    title: "ENHANCEDBONUSBUILDER.MarkersDialog.title",
    content: html,
    buttons: {
      submit: {
        label: "ENHANCEDBONUSBUILDER.MarkersDialog.submit",
        icon: "fas fa-check",
        callback: async (html) => {
          const form = html.querySelector("form");
          const fd = new FormDataExtended(form);
          const markers = fd.object.markers ?? [];
          return document.setFlag("enhanced-bonus-builder", "markers", markers);
        }
      },
      cancel: {
        label: "ENHANCEDBONUSBUILDER.MarkersDialog.cancel",
        icon: "fas fa-times"
      }
    }
  });
}

/**
 * Create a new bonus for a document.
 * @param {Document} document The document to create the bonus for.
 * @param {string} type The type of bonus to create.
 * @param {object} [data={}] Initial data for the bonus.
 * @returns {models.Babonus} The created bonus.
 */
function createBonus(document, type, data = {}) {
  const Model = models[type];
  if (!Model) throw new Error(`Invalid bonus type: ${type}`);
  
  const id = foundry.utils.randomID();
  const bonus = new Model({
    id,
    name: game.i18n.localize("ENHANCEDBONUSBUILDER.NewBonus"),
    type,
    ...data
  }, {parent: document});
  
  return bonus;
}

/**
 * Duplicate an existing bonus.
 * @param {models.Babonus} bonus The bonus to duplicate.
 * @returns {models.Babonus} The duplicated bonus.
 */
function duplicateBonus(bonus) {
  const data = foundry.utils.deepClone(bonus.toObject());
  data.id = foundry.utils.randomID();
  data.name = `${data.name} (${game.i18n.localize("ENHANCEDBONUSBUILDER.Copy")})`;
  
  const Model = models[bonus.type];
  return new Model(data, {parent: bonus.parent});
}

/**
 * Embed a bonus in a document.
 * @param {Document} document The document to embed the bonus in.
 * @param {models.Babonus} bonus The bonus to embed.
 * @returns {Promise<Document>} The updated document.
 */
async function embedBonus(document, bonus) {
  const bonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  bonuses[bonus.id] = bonus.toObject();
  
  return document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
}

/**
 * Find all embedded documents with bonuses.
 * @param {Actor} actor The actor to search.
 * @returns {Document[]} The embedded documents with bonuses.
 */
function findEmbeddedDocumentsWithBonuses(actor) {
  const documents = [];
  
  // Check actor
  if (actor.getFlag("enhanced-bonus-builder", "bonuses")) {
    documents.push(actor);
  }
  
  // Check items
  for (const item of actor.items) {
    if (item.getFlag("enhanced-bonus-builder", "bonuses")) {
      documents.push(item);
    }
  }
  
  // Check effects
  for (const effect of actor.effects) {
    if (effect.getFlag("enhanced-bonus-builder", "bonuses")) {
      documents.push(effect);
    }
  }
  
  return documents;
}

/**
 * Get a bonus from a UUID.
 * @param {string} uuid The UUID of the document.
 * @param {string} bonusId The ID of the bonus.
 * @returns {Promise<models.Babonus|null>} The bonus, or null if not found.
 */
async function bonusFromUuid(uuid, bonusId) {
  const document = await fromUuid(uuid);
  if (!document) return null;
  
  const bonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  const data = bonuses[bonusId];
  if (!data) return null;
  
  const Model = models[data.type];
  if (!Model) return null;
  
  return new Model(data, {parent: document});
}

/**
 * Get a bonus from a UUID synchronously.
 * @param {string} uuid The UUID of the document.
 * @param {string} bonusId The ID of the bonus.
 * @returns {models.Babonus|null} The bonus, or null if not found.
 */
function bonusFromUuidSync(uuid, bonusId) {
  const document = fromUuidSync(uuid);
  if (!document) return null;
  
  const bonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  const data = bonuses[bonusId];
  if (!data) return null;
  
  const Model = models[data.type];
  if (!Model) return null;
  
  return new Model(data, {parent: document});
}

/**
 * Get a collection of bonuses for a document.
 * @param {Document} document The document to get bonuses for.
 * @returns {applications.BonusCollection} The collection of bonuses.
 */
function getCollection(document) {
  return new applications.BonusCollection(document);
}

/**
 * Check if an actor has proficiency with an armor.
 * @param {Actor} actor The actor to check.
 * @param {Item} item The armor item.
 * @returns {boolean} Whether the actor has proficiency.
 */
function hasArmorProficiency(actor, item) {
  if (!actor || !item || item.type !== "equipment" || item.system.armor?.type === "shield") {
    return false;
  }
  
  const armorProf = actor.system.traits?.armorProf ?? {};
  const armor = item.system.armor?.type;
  
  if (!armor || armorProf.value?.includes(armor)) return true;
  
  // Check custom proficiencies
  if (armorProf.custom) {
    const custom = armorProf.custom.toLowerCase();
    const name = item.name.toLowerCase();
    return custom.split(";").some(c => name.includes(c.trim()));
  }
  
  return false;
}

/**
 * Check if an actor has proficiency with a tool.
 * @param {Actor} actor The actor to check.
 * @param {Item} item The tool item.
 * @returns {boolean} Whether the actor has proficiency.
 */
function hasToolProficiency(actor, item) {
  if (!actor || !item || item.type !== "tool") return false;
  
  const toolProf = actor.system.traits?.toolProf ?? {};
  const tool = item.system.toolType;
  
  if (toolProf.value?.includes(tool)) return true;
  
  // Check custom proficiencies
  if (toolProf.custom) {
    const custom = toolProf.custom.toLowerCase();
    const name = item.name.toLowerCase();
    return custom.split(";").some(c => name.includes(c.trim()));
  }
  
  return false;
}

/**
 * Check if an actor has proficiency with a weapon.
 * @param {Actor} actor The actor to check.
 * @param {Item} item The weapon item.
 * @returns {boolean} Whether the actor has proficiency.
 */
function hasWeaponProficiency(actor, item) {
  if (!actor || !item || item.type !== "weapon") return false;
  
  const weaponProf = actor.system.traits?.weaponProf ?? {};
  const weapon = item.system.weaponType;
  
  if (weaponProf.value?.includes(weapon)) return true;
  
  // Check for simple/martial proficiency
  const isMartial = item.system.properties?.mar;
  const isSimple = !isMartial;
  
  if ((isSimple && weaponProf.value?.includes("sim")) || 
      (isMartial && weaponProf.value?.includes("mar"))) {
    return true;
  }
  
  // Check custom proficiencies
  if (weaponProf.custom) {
    const custom = weaponProf.custom.toLowerCase();
    const name = item.name.toLowerCase();
    return custom.split(";").some(c => name.includes(c.trim()));
  }
  
  return false;
}

/**
 * Toggle a bonus on the hotbar.
 * @param {string} uuid The UUID of the document.
 * @param {string} bonusId The ID of the bonus.
 * @returns {Promise<boolean>} Whether the bonus was toggled.
 */
async function hotbarToggle(uuid, bonusId) {
  const bonus = await bonusFromUuid(uuid, bonusId);
  if (!bonus) return false;
  
  const enabled = !bonus.enabled;
  const bonuses = bonus.parent.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  bonuses[bonusId].enabled = enabled;
  
  await bonus.parent.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
  
  // Show notification
  const status = enabled ? "ENHANCEDBONUSBUILDER.Enabled" : "ENHANCEDBONUSBUILDER.Disabled";
  ui.notifications.info(`${bonus.name}: ${game.i18n.localize(status)}`);
  
  return true;
}

/**
 * Open the bonus workshop for a document.
 * @param {Document} document The document to open the workshop for.
 * @returns {applications.BabonusWorkshop} The workshop application.
 */
function openBonusWorkshop(document) {
  const workshop = new applications.BabonusWorkshop(document);
  workshop.render(true);
  return workshop;
}

/**
 * Open bonus workshop for the selected actor (for macro use)
 * @returns {Promise

/**
 * Get the proficiency tree for an actor.
 * @param {Actor} actor The actor to get the proficiency tree for.
 * @returns {object} The proficiency tree.
 */
function proficiencyTree(actor) {
  if (!actor) return {};
  
  const tree = {};
  const traits = actor.system.traits ?? {};
  
  // Armor proficiencies
  tree.armor = {};
  if (traits.armorProf?.value) {
    for (const prof of traits.armorProf.value) {
      tree.armor[prof] = true;
    }
  }
  
  // Weapon proficiencies
  tree.weapon = {};
  if (traits.weaponProf?.value) {
    for (const prof of traits.weaponProf.value) {
      tree.weapon[prof] = true;
    }
  }
  
  // Tool proficiencies
  tree.tool = {};
  if (traits.toolProf?.value) {
    for (const prof of traits.toolProf.value) {
      tree.tool[prof] = true;
    }
  }
  
  return tree;
}

/**
 * Check if an actor speaks a language.
 * @param {Actor} actor The actor to check.
 * @param {string} language The language to check.
 * @returns {boolean} Whether the actor speaks the language.
 */
function speaksLanguage(actor, language) {
  if (!actor || !language) return false;
  
  const langs = actor.system.traits?.languages ?? {};
  
  if (langs.value?.includes(language)) return true;
  
  // Check custom languages
  if (langs.custom) {
    const custom = langs.custom.toLowerCase();
    language = language.toLowerCase();
    return custom.split(";").some(l => l.trim() === language);
  }
  
  return false;
}
/**
 * Open bonus workshop for the selected actor (for macro use)
 * @returns {Promise<applications.BabonusWorkshop|null>} The workshop instance or null if no actor selected
 */
async function openBonusWorkshopForActor() {
  const actor = game.user.character || canvas.tokens.controlled[0]?.actor;
  if (!actor) {
    ui.notifications.warn("Please select an actor or token first.");
    return null;
  }
  const workshop = new applications.BabonusWorkshop(actor);
  workshop.render(true);
  return workshop;
}

/**
 * Set up the character sheet tab.
 */
function characterSheetTabSetup() {
  // Add the tab to character sheets
  Hooks.on("renderActorSheet5e", (app, html, data) => {
    // Skip if the setting is disabled
    if (!game.settings.get(MODULE.ID, SETTINGS.SHOW_SHEET_TAB)) return;
    
    // Add the tab button
    const tabs = html.find('.tabs[data-group="primary"]');
    if (tabs.length === 0) return;
    
    const tabButton = $(`<a class="item" data-tab="bonuses">
      <i class="fas fa-calculator"></i> ${game.i18n.localize("ENHANCEDBONUSBUILDER.ModuleTitle")}
    </a>`);
    
    tabs.append(tabButton);
    
    // Add the tab content
    const sheetBody = html.find('.sheet-body');
    if (sheetBody.length === 0) return;
    
    const tabContent = $(`<div class="tab enhanced-bonus-builder-tab" data-group="primary" data-tab="bonuses"></div>`);
    sheetBody.append(tabContent);
    
    // Render the tab content
    renderBonusTab(app.actor, tabContent);
    
    // Activate the tabs
    app._tabs[0].bind(html[0]);
  });
}

/**
 * Render the bonus tab content.
 * @param {Actor} actor The actor.
 * @param {jQuery} html The tab content element.
 */
async function renderBonusTab(actor, html) {
  // Get all bonuses for the actor
  const collection = api.getCollection(actor);
  const bonuses = collection.getAll();
  
  // Group bonuses by type
  const bonusesByType = {};
  for (const bonus of bonuses) {
    if (!bonusesByType[bonus.type]) {
      bonusesByType[bonus.type] = [];
    }
    bonusesByType[bonus.type].push(bonus);
  }
  
  // Create the HTML
  let content = `
    <div class="enhanced-bonus-builder-tab-content">
      <div class="header">
        <h2>${game.i18n.localize("ENHANCEDBONUSBUILDER.ModuleTitle")}</h2>
        <button type="button" class="create-bonus">
          <i class="fas fa-plus"></i> ${game.i18n.localize("ENHANCEDBONUSBUILDER.CreateBonus")}
        </button>
      </div>
  `;
  
  // Add bonuses by type
  for (const [type, typeBonuses] of Object.entries(bonusesByType)) {
    content += `
      <div class="bonus-type-section">
        <h3>${game.i18n.localize(`ENHANCEDBONUSBUILDER.BonusTypes.${type}`)}</h3>
        <ul class="bonus-list">
    `;
    
    for (const bonus of typeBonuses) {
      const enabledClass = bonus.enabled ? "enhanced-bonus-builder-enabled" : "enhanced-bonus-builder-disabled";
      const enabledIcon = bonus.enabled ? "fa-check-circle" : "fa-times-circle";
      
      content += `
        <li class="bonus-item" data-bonus-id="${bonus.id}">
          <div class="bonus-name">${bonus.name}</div>
          <div class="bonus-controls">
            <a class="bonus-control toggle-bonus" title="${game.i18n.localize("ENHANCEDBONUSBUILDER.ToggleBonus")}">
              <i class="fas ${enabledIcon} ${enabledClass}"></i>
            </a>
            <a class="bonus-control edit-bonus" title="${game.i18n.localize("ENHANCEDBONUSBUILDER.EditBonus")}">
              <i class="fas fa-edit"></i>
            </a>
            <a class="bonus-control delete-bonus" title="${game.i18n.localize("ENHANCEDBONUSBUILDER.DeleteBonus")}">
              <i class="fas fa-trash"></i>
            </a>
          </div>
        </li>
      `;
    }
    
    content += `
        </ul>
      </div>
    `;
  }
  
  // If no bonuses, show a message
  if (Object.keys(bonusesByType).length === 0) {
    content += `
      <div class="no-bonuses">
        <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.NoBonuses")}</p>
      </div>
    `;
  }
  
  content += `</div>`;
  
  // Set the HTML
  html.html(content);
  
  // Add event listeners
  html.find('.create-bonus').click(() => {
    const workshop = new BabonusWorkshop(actor);
    workshop.render(true);
  });
  
  html.find('.toggle-bonus').click(async (event) => {
    const bonusId = $(event.currentTarget).closest('.bonus-item').data('bonus-id');
    await api.hotbarToggle(actor.uuid, bonusId);
    renderBonusTab(actor, html);
  });
  
  html.find('.edit-bonus').click(async (event) => {
    const bonusId = $(event.currentTarget).closest('.bonus-item').data('bonus-id');
    const bonus = await api.fromUuid(actor.uuid, bonusId);
    if (bonus) {
      const sheet = new BabonusSheet({bonus});
      sheet.render(true);
    }
  });
  
  html.find('.delete-bonus').click(async (event) => {
    const bonusId = $(event.currentTarget).closest('.bonus-item').data('bonus-id');
    
    const confirmed = await Dialog.confirm({
      title: game.i18n.localize("Delete Bonus"),
      content: `<p>${game.i18n.localize("ENHANCEDBONUSBUILDER.DeleteBonusConfirm")}</p>`,
      defaultYes: false
    });
    
    if (confirmed) {
      await collection.remove(bonusId);
      renderBonusTab(actor, html);
    }
  });
}

/**
 * Set up text enrichers.
 */
function enricherSetup() {
  // Add the bonus enricher
  CONFIG.TextEditor.enrichers.push({
    pattern: /@bonus\[([^\]]+)\](?:{([^}]+)})?/gi,
    enricher: enrichBonus
  });
}

/**
 * Enrich a bonus reference.
 * @param {object} match The regex match.
 * @param {object} options The enrichment options.
 * @returns {Promise<HTMLElement>} The enriched HTML.
 */
async function enrichBonus(match, options) {
  const [, reference, label] = match;
  
  // Parse the reference
  const [documentUuid, bonusId] = reference.split(".");
  if (!documentUuid || !bonusId) return null;
  
  // Get the bonus
  const bonus = await api.fromUuid(documentUuid, bonusId);
  if (!bonus) return null;
  
  // Create the element
  const element = document.createElement("a");
  element.classList.add("enhanced-bonus-builder-link");
  element.dataset.uuid = documentUuid;
  element.dataset.bonusId = bonusId;
  element.title = bonus.name;
  
  // Set the content
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-calculator", "enhanced-bonus-builder-icon");
  if (bonus.iconColor) {
    icon.style.color = bonus.iconColor;
  }
  
  element.appendChild(icon);
  element.appendChild(document.createTextNode(label || bonus.name));
  
  // Add event listener
  element.addEventListener("click", async (event) => {
    event.preventDefault();
    
    // Toggle the bonus
    await api.hotbarToggle(documentUuid, bonusId);
  });
  
  return element;
}

/**
 * Set up injections into the Foundry VTT interface.
 */
function setup() {
  // Inject the bonus button into actor sheets
  Hooks.on("renderActorSheet", injectActorSheetButton);
  
  // Inject the bonus button into item sheets
  Hooks.on("renderItemSheet", injectItemSheetButton);
  
  // Inject the bonus button into effect sheets
  Hooks.on("renderActiveEffectConfig", injectEffectSheetButton);
  
  // Inject the bonus button into region sheets
  Hooks.on("renderRegionConfig", injectRegionSheetButton);
}

/**
 * Inject the bonus button into actor sheets.
 * @param {ActorSheet} app The actor sheet.
 * @param {jQuery} html The HTML element.
 * @param {object} data The data.
 */
function injectActorSheetButton(app, html, data) {
  // Skip if not a DnD5e actor
  if (app.actor.system.schema.name !== "dnd5e.ActorDataModel") return;
  
  // Find the header
  const header = html.find('.window-header .window-title');
  if (header.length === 0) return;
  
  // Create the button
  const button = $(`<a class="enhanced-bonus-builder-button" title="${game.i18n.localize("ENHANCEDBONUSBUILDER.OpenWorkshop")}">
    <i class="fas fa-calculator enhanced-bonus-builder-icon"></i>
  </a>`);
  
  // Add the button after the header
  header.after(button);
  
  // Add event listener
  button.click(() => {
    api.openBonusWorkshop(app.actor);
  });
}

/**
 * Inject the bonus button into item sheets.
 * @param {ItemSheet} app The item sheet.
 * @param {jQuery} html The HTML element.
 * @param {object} data The data.
 */
function injectItemSheetButton(app, html, data) {
  // Skip if not a DnD5e item
  if (app.item.system.schema.name !== "dnd5e.ItemDataModel") return;
  
  // Find the header
  const header = html.find('.window-header .window-title');
  if (header.length === 0) return;
  
  // Create the button
  const button = $(`<a class="enhanced-bonus-builder-button" title="${game.i18n.localize("ENHANCEDBONUSBUILDER.OpenWorkshop")}">
    <i class="fas fa-calculator enhanced-bonus-builder-icon"></i>
  </a>`);
  
  // Add the button after the header
  header.after(button);
  
  // Add event listener
  button.click(() => {
    api.openBonusWorkshop(app.item);
  });
}

/**
 * Inject the bonus button into effect sheets.
 * @param {ActiveEffectConfig} app The effect sheet.
 * @param {jQuery} html The HTML element.
 * @param {object} data The data.
 */
function injectEffectSheetButton(app, html, data) {
  // Skip if not a DnD5e effect
  if (!app.object.parent || app.object.parent.system.schema.name !== "dnd5e.ActorDataModel") return;
  
  // Find the header
  const header = html.find('.window-header .window-title');
  if (header.length === 0) return;
  
  // Create the button
  const button = $(`<a class="enhanced-bonus-builder-button" title="${game.i18n.localize("ENHANCEDBONUSBUILDER.OpenWorkshop")}">
    <i class="fas fa-calculator enhanced-bonus-builder-icon"></i>
  </a>`);
  
  // Add the button after the header
  header.after(button);
  
  // Add event listener
  button.click(() => {
    api.openBonusWorkshop(app.object);
  });
}

/**
 * Inject the bonus button into region sheets.
 * @param {RegionConfig} app The region sheet.
 * @param {jQuery} html The HTML element.
 * @param {object} data The data.
 */
function injectRegionSheetButton(app, html, data) {
  // Find the header
  const header = html.find('.window-header .window-title');
  if (header.length === 0) return;
  
  // Create the button
  const button = $(`<a class="enhanced-bonus-builder-button" title="${game.i18n.localize("ENHANCEDBONUSBUILDER.OpenWorkshop")}">
    <i class="fas fa-calculator enhanced-bonus-builder-icon"></i>
  </a>`);
  
  // Add the button after the header
  header.after(button);
  
  // Add event listener
  button.click(() => {
    api.openBonusWorkshop(app.object);
  });
}

var injections = { setup };

/**
 * Handle the preRollAttack hook.
 * @param {Actor} actor The actor rolling the attack.
 * @param {Item} item The item being used.
 * @param {object} config The roll configuration.
 */
async function preRollAttack(actor, item, config) {
  if (!actor || !item) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "attackRoll",
    actor,
    item,
    config
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "attackRoll",
    options: {
      actor,
      item
    }
  };
}

/**
 * Handle the rollAttack hook.
 * @param {Actor} actor The actor rolling the attack.
 * @param {Item} item The item being used.
 * @param {Roll} roll The attack roll.
 * @param {object} ammo The ammunition used, if any.
 */
async function rollAttack(actor, item, roll, ammo) {
  if (!actor || !item || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("attackRoll", {
    actor,
    item,
    roll,
    ammo
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating attack roll bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollDamage hook.
 * @param {Actor} actor The actor rolling damage.
 * @param {Item} item The item being used.
 * @param {object} config The roll configuration.
 */
async function preRollDamage(actor, item, config) {
  if (!actor || !item) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "damageRoll",
    actor,
    item,
    config
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "damageRoll",
    options: {
      actor,
      item,
      critical: config.critical
    }
  };
}

/**
 * Handle the rollDamage hook.
 * @param {Actor} actor The actor rolling damage.
 * @param {Item} item The item being used.
 * @param {Roll} roll The damage roll.
 * @param {object} ammo The ammunition used, if any.
 * @param {object} options The roll options.
 */
async function rollDamage(actor, item, roll, ammo, options) {
  if (!actor || !item || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("damageRoll", {
    actor,
    item,
    roll,
    ammo,
    critical: options?.critical
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value,
        damageType: bonus.damageType
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating damage roll bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => {
      const type = p.damageType ? ` (${game.i18n.localize(`DND5E.Damage${p.damageType.capitalize()}`)})` : "";
      return `<li>${p.name}${type}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`;
    }).join("");
    
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollAbilitySave hook.
 * @param {Actor} actor The actor rolling the save.
 * @param {object} config The roll configuration.
 * @param {string} ability The ability being used.
 */
async function preRollAbilitySave(actor, config, ability) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "savingThrow",
    actor,
    config,
    ability
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "savingThrow",
    options: {
      actor,
      ability
    }
  };
}

/**
 * Handle the rollAbilitySave hook.
 * @param {Actor} actor The actor rolling the save.
 * @param {Roll} roll The save roll.
 * @param {string} ability The ability being used.
 */
async function rollAbilitySave(actor, roll, ability) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("savingThrow", {
    actor,
    roll,
    ability
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating saving throw bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollAbilityTest hook.
 * @param {Actor} actor The actor rolling the test.
 * @param {object} config The roll configuration.
 * @param {string} ability The ability being used.
 */
async function preRollAbilityTest(actor, config, ability) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "abilityCheck",
    actor,
    config,
    ability
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "abilityCheck",
    options: {
      actor,
      ability
    }
  };
}

/**
 * Handle the rollAbilityTest hook.
 * @param {Actor} actor The actor rolling the test.
 * @param {Roll} roll The test roll.
 * @param {string} ability The ability being used.
 */
async function rollAbilityTest(actor, roll, ability) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("abilityCheck", {
    actor,
    roll,
    ability
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating ability check bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollDeathSave hook.
 * @param {Actor} actor The actor rolling the death save.
 * @param {object} config The roll configuration.
 */
async function preRollDeathSave(actor, config) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "savingThrow",
    actor,
    config,
    ability: "death"
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "savingThrow",
    options: {
      actor,
      ability: "death"
    }
  };
}

/**
 * Handle the rollDeathSave hook.
 * @param {Actor} actor The actor rolling the death save.
 * @param {Roll} roll The death save roll.
 */
async function rollDeathSave(actor, roll) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("savingThrow", {
    actor,
    roll,
    ability: "death"
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating death save bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollHitDie hook.
 * @param {Actor} actor The actor rolling the hit die.
 * @param {object} config The roll configuration.
 * @param {string} denomination The hit die denomination.
 */
async function preRollHitDie(actor, config, denomination) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "hitDie",
    actor,
    config,
    denomination
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "hitDie",
    options: {
      actor,
      denomination
    }
  };
}

/**
 * Handle the rollHitDie hook.
 * @param {Actor} actor The actor rolling the hit die.
 * @param {Roll} roll The hit die roll.
 */
async function rollHitDie(actor, roll) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("hitDie", {
    actor,
    roll
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating hit die bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

var mutators = {
  preRollAttack,
  rollAttack,
  preRollDamage,
  rollDamage,
  preRollAbilitySave,
  rollAbilitySave,
  preRollAbilityTest,
  rollAbilityTest,
  preRollDeathSave,
  rollDeathSave,
  preRollHitDie,
  rollHitDie
};

// Setup API object
globalThis.enhancedBonusBuilder = {
  api,
  abstract: {
    DataModels: models.Babonus,
    DataFields: {
      fields: fields,
      models: models
    }
  },
  TYPES: Object.keys(models.Babonus),
  applications: applications,
  filters: {...filters}
};

/**
 * Render the optional bonus selector on a roll dialog.
 * @param {Dialog} dialog The dialog being rendered.
 */
async function renderDialog(dialog) {
  const m = dialog.options.enhancedBonusBuilder;
  if (!m) return;
  const r = registry.get(m.registry);
  if (!r) return;

  dialog.enhancedBonusBuilder = {
    dialog,
    registry: r,
    type: m.type,
    options: m.options
  };

  // Create and render the optional selector
  const selector = new OptionalSelector(dialog.enhancedBonusBuilder);
  await selector.render(true);
}

/**
 * Register module settings.
 */
function registerSettings() {
  // Register migration setting
  game.settings.register(MODULE.ID, SETTINGS.MIGRATE, {
    name: "ENHANCEDBONUSBUILDER.Settings.migrate.Name",
    hint: "ENHANCEDBONUSBUILDER.Settings.migrate.Hint",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Register show applied bonuses setting
  game.settings.register(MODULE.ID, SETTINGS.SHOW_APPLIED, {
    name: "ENHANCEDBONUSBUILDER.Settings.showApplied.Name",
    hint: "ENHANCEDBONUSBUILDER.Settings.showApplied.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  // Register show optional bonuses setting
  game.settings.register(MODULE.ID, SETTINGS.SHOW_OPTIONAL, {
    name: "ENHANCEDBONUSBUILDER.Settings.showOptional.Name",
    hint: "ENHANCEDBONUSBUILDER.Settings.showOptional.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  // Register show sheet tab setting
  game.settings.register(MODULE.ID, SETTINGS.SHOW_SHEET_TAB, {
    name: "ENHANCEDBONUSBUILDER.Settings.showSheetTab.Name",
    hint: "ENHANCEDBONUSBUILDER.Settings.showSheetTab.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: value => {
      // Refresh open character sheets
      for (const app of Object.values(ui.windows)) {
        if (app.document?.documentName === "Actor") {
          app.render();
        }
      }
    }
  });
}

/**
 * Initialize the module.
 */
async function init() {
  registerSettings();
  
  // Register templates
  const templatePaths = Object.values(MODULE.TEMPLATES);
  loadTemplates(templatePaths);

  // Setup hooks
  Hooks.on("renderDialog", renderDialog);
  
  // Setup enrichers
  enricherSetup();
  
  // Setup character sheet tab
  if (game.settings.get(MODULE.ID, SETTINGS.SHOW_SHEET_TAB)) {
    characterSheetTabSetup();
  }
  
  // Setup injections
  injections.setup();
}

/**
 * Ready hook.
 */
async function ready() {
  // Check for migration
  const currentVersion = game.modules.get(MODULE.ID).version;
  const lastVersion = game.settings.get(MODULE.ID, SETTINGS.MIGRATE);
  
  if (currentVersion !== lastVersion) {
    // Perform migration if needed
    await game.settings.set(MODULE.ID, SETTINGS.MIGRATE, currentVersion);
  }
  
  // Create macro for easy access
  if (game.user.isGM) {
    const existingMacro = game.macros.find(m => m.name === "Enhanced Bonus Builder");
    if (!existingMacro) {
      await Macro.create({
        name: "Enhanced Bonus Builder",
        type: "script",
        command: `game.modules.get('enhanced-bonus-builder').api.openBonusWorkshopForActor();`,
        img: "icons/svg/dice-target.svg",
        scope: "global"
      });
    }
  }
}

// Register hooks
Hooks.once("init", init);
Hooks.once("ready", ready);

// Register mutators
Hooks.on("dnd5e.preRollAttack", mutators.preRollAttack);
Hooks.on("dnd5e.rollAttack", mutators.rollAttack);
Hooks.on("dnd5e.preRollDamage", mutators.preRollDamage);
Hooks.on("dnd5e.rollDamage", mutators.rollDamage);
Hooks.on("dnd5e.preRollAbilitySave", mutators.preRollAbilitySave);
Hooks.on("dnd5e.rollAbilitySave", mutators.rollAbilitySave);
Hooks.on("dnd5e.preRollAbilityTest", mutators.preRollAbilityTest);
Hooks.on("dnd5e.rollAbilityTest", mutators.rollAbilityTest);
Hooks.on("dnd5e.preRollDeathSave", mutators.preRollDeathSave);
Hooks.on("dnd5e.rollDeathSave", mutators.rollDeathSave);
Hooks.on("dnd5e.preRollHitDie", mutators.preRollHitDie);
Hooks.on("dnd5e.rollHitDie", mutators.rollHitDie);
//# sourceMappingURL=enhanced-bonus-builder.js.map
