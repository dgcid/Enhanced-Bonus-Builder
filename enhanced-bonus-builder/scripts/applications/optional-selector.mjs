import { MODULE, SETTINGS } from "../constants.mjs";
import registry from "../registry.mjs";

/**
 * A dialog for selecting optional bonuses.
 */
export default class OptionalSelector extends Application {
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