/**
 * Enhanced Bonus Builder - Foundry VTT 13 Compatible Version
 * This is a basic implementation that adds the button to character sheets
 * and provides minimal functionality to verify the module is working.
 */

// Module constants
const MODULE_ID = "enhanced-bonus-builder";
const MODULE_TITLE = "Enhanced Bonus Builder";

// Initialize the module
Hooks.once("init", () => {
  console.log(`${MODULE_TITLE} | Initializing`);
  
  // Register settings
  game.settings.register(MODULE_ID, "showSheetTab", {
    name: "Show Sheet Tab",
    hint: "Show a tab in character sheets for managing bonuses.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
  
  // Register other settings
  game.settings.register(MODULE_ID, "showApplied", {
    name: "Show Applied Bonuses",
    hint: "Show a chat message with the bonuses that were applied to a roll.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
  
  game.settings.register(MODULE_ID, "showOptional", {
    name: "Show Optional Bonuses",
    hint: "Show a dialog with optional bonuses that can be applied to a roll.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
});

// Add the button to character sheets - compatible with Foundry VTT 13
Hooks.on("renderActorSheet", (app, html, data) => {
  // Only apply to DnD5e actor sheets
  if (!app.actor || !app.actor.system || app.actor.system.schema?.name !== "dnd5e.ActorDataModel") {
    return;
  }
  
  console.log(`${MODULE_TITLE} | Rendering actor sheet for ${app.actor.name}`);
  
  try {
    // Add the button to the header - Foundry VTT 13 compatible approach
    const header = html.find('.window-header .window-title');
    if (header.length) {
      const button = $(`<a class="enhanced-bonus-builder-button" title="${MODULE_TITLE}">
        <i class="fas fa-calculator"></i>
      </a>`);
      
      header.after(button);
      console.log(`${MODULE_TITLE} | Button added to sheet header`);
      
      // Add click handler
      button.click(() => {
        openBonusWorkshop(app.actor);
      });
    } else {
      console.log(`${MODULE_TITLE} | Could not find window header`);
    }
    
    // Add the tab if enabled - Foundry VTT 13 compatible approach
    if (game.settings.get(MODULE_ID, "showSheetTab")) {
      // Find the tabs container - different selectors for different sheet types
      let tabs = html.find('.tabs[data-group="primary"]');
      if (tabs.length === 0) {
        tabs = html.find('.sheet-tabs');
      }
      if (tabs.length === 0) {
        tabs = html.find('.tabs');
      }
      
      if (tabs.length === 0) {
        console.log(`${MODULE_TITLE} | Could not find tabs container`);
        return;
      }
      
      const tabButton = $(`<a class="item" data-tab="bonuses">
        <i class="fas fa-calculator"></i> ${MODULE_TITLE}
      </a>`);
      
      tabs.append(tabButton);
      console.log(`${MODULE_TITLE} | Tab button added`);
      
      // Find the sheet body - different selectors for different sheet types
      let sheetBody = html.find('.sheet-body');
      if (sheetBody.length === 0) {
        sheetBody = html.find('.sheet-content');
      }
      if (sheetBody.length === 0) {
        sheetBody = html.find('.tab-content');
      }
      
      if (sheetBody.length === 0) {
        console.log(`${MODULE_TITLE} | Could not find sheet body`);
        return;
      }
      
      const tabContent = $(`<div class="tab enhanced-bonus-builder-tab" data-group="primary" data-tab="bonuses">
        <div class="enhanced-bonus-builder-tab-content">
          <div class="header">
            <h2>${MODULE_TITLE}</h2>
            <button type="button" class="create-bonus">
              <i class="fas fa-plus"></i> Create Bonus
            </button>
          </div>
          <div class="content">
            <p>This is a simplified version of the Enhanced Bonus Builder module.</p>
            <p>The full functionality is not yet implemented in this version.</p>
            <p>Actor: ${app.actor.name}</p>
          </div>
        </div>
      </div>`);
      
      sheetBody.append(tabContent);
      console.log(`${MODULE_TITLE} | Tab content added`);
      
      // Add click handler for create bonus button
      tabContent.find('.create-bonus').click(() => {
        openBonusWorkshop(app.actor);
      });
      
      // Activate the tabs - Foundry VTT 13 compatible approach
      if (app._tabs && app._tabs[0]) {
        app._tabs[0].bind(html[0]);
      } else if (app.options && app.options.tabs && app.options.tabs.length) {
        const tabsElement = html.find('.tabs[data-group="primary"]');
        const contentElement = html.find('.tab[data-group="primary"]');
        if (tabsElement.length && contentElement.length) {
          const tabs = new foundry.ui.Tabs({
            navSelector: ".tabs",
            contentSelector: ".tab",
            initial: app.options.tabs[0].initial,
            callback: app.options.tabs[0].callback
          });
          tabs.bind(html[0]);
        }
      }
    }
  } catch (error) {
    console.error(`${MODULE_TITLE} | Error in renderActorSheet hook:`, error);
  }
});

// Simple dialog to simulate the bonus workshop - Foundry VTT 13 compatible
function openBonusWorkshop(actor) {
  console.log(`${MODULE_TITLE} | Opening bonus workshop for ${actor.name}`);
  
  const content = `
    <h2>Enhanced Bonus Builder</h2>
    <p>This is a simplified version of the module.</p>
    <p>The full functionality is not yet implemented.</p>
    <p>Actor: ${actor.name}</p>
  `;
  
  // Use DialogV2 if available (Foundry VTT 13), otherwise fall back to Dialog
  if (foundry.applications && foundry.applications.api && foundry.applications.api.DialogV2) {
    new foundry.applications.api.DialogV2({
      title: MODULE_TITLE,
      content: content,
      buttons: {
        close: {
          label: "Close",
          callback: () => console.log("Dialog closed")
        }
      }
    }).render(true);
  } else {
    new Dialog({
      title: MODULE_TITLE,
      content: content,
      buttons: {
        close: {
          label: "Close",
          callback: () => console.log("Dialog closed")
        }
      }
    }).render(true);
  }
}

// Log when ready
Hooks.once("ready", () => {
  console.log(`${MODULE_TITLE} | Ready`);
});

// Add debug information
Hooks.once("ready", () => {
  console.log(`${MODULE_TITLE} | Foundry VTT Version: ${game.version}`);
  console.log(`${MODULE_TITLE} | System: ${game.system.id} (${game.system.version})`);
  console.log(`${MODULE_TITLE} | Module Settings:`, {
    showSheetTab: game.settings.get(MODULE_ID, "showSheetTab"),
    showApplied: game.settings.get(MODULE_ID, "showApplied"),
    showOptional: game.settings.get(MODULE_ID, "showOptional")
  });
});