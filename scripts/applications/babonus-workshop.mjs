import { MODULE, BONUS_TYPES } from "../constants.mjs";
import api from "../api.mjs";
import BabonusSheet from "./babonus-sheet.mjs";

/**
 * The application for creating new bonuses.
 */
export default class BabonusWorkshop extends Application {
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