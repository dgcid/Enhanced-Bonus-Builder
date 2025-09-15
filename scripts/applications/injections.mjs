import { MODULE } from "../constants.mjs";
import api from "../api.mjs";

/**
 * Set up injections into the Foundry VTT interface.
 */
export function setup() {
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

export default { setup };