import { MODULE, SETTINGS } from "../constants.mjs";
import api from "../api.mjs";
import BabonusSheet from "./babonus-sheet.mjs";
import BabonusWorkshop from "./babonus-workshop.mjs";

/**
 * Set up the character sheet tab.
 */
export default function characterSheetTabSetup() {
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