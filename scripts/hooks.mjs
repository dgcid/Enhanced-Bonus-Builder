import { MODULE, SETTINGS } from "./constants.mjs";
import * as filterings from "./applications/filterings.mjs";
import api from "./api.mjs";
import applications from "./applications/_module.mjs";
import characterSheetTabSetup from "./applications/character-sheet-tab.mjs";
import enricherSetup from "./applications/enrichers.mjs";
import fields from "./fields/_module.mjs";
import injections from "./applications/injections.mjs";
import models from "./models/_module.mjs";
import mutators from "./mutators.mjs";
import OptionalSelector from "./applications/optional-selector.mjs";
import registry from "./registry.mjs";

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
  filters: {...filterings.filters}
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