/**
 * Enhanced Bonus Builder - Foundry VTT 13 Compatible Version
 * This module provides a replacement for the Build-a-Bonus module
 * with compatibility for Foundry VTT versions 11-13.
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
    default: true,
    onChange: () => {
      // Refresh all actor sheets when this setting changes
      Object.values(ui.windows).forEach(app => {
        if (app.document?.documentName === "Actor") {
          app.render();
        }
      });
    }
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

  // Register standalone interface setting
  game.settings.register(MODULE_ID, "useStandaloneInterface", {
    name: "Use Standalone Interface",
    hint: "Use a standalone interface instead of integrating with character sheets.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  // Register debug mode setting
  game.settings.register(MODULE_ID, "debugMode", {
    name: "Debug Mode",
    hint: "Enable debug logging for troubleshooting.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });
});

/**
 * Log a debug message if debug mode is enabled
 * @param {...any} args - Arguments to log
 */
function debug(...args) {
  if (game.settings.get(MODULE_ID, "debugMode")) {
    console.log(`${MODULE_TITLE} | DEBUG |`, ...args);
  }
}

// Create a standalone application for managing bonuses
class EnhancedBonusBuilderApp extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "enhanced-bonus-builder",
      title: MODULE_TITLE,
      template: `modules/${MODULE_ID}/templates/standalone-app.html`,
      width: 600,
      height: 800,
      resizable: true,
      classes: ["enhanced-bonus-builder"]
    });
  }

  getData() {
    // Get the selected actor
    const actor = game.user.character || canvas.tokens.controlled[0]?.actor;
    
    return {
      actor: actor,
      actors: game.actors.contents.filter(a => a.isOwner),
      hasActor: !!actor,
      actorName: actor?.name || "No Actor Selected"
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    
    // Actor selection
    html.find('.actor-select').change(event => {
      const actorId = event.currentTarget.value;
      this.selectedActor = game.actors.get(actorId);
      this.render();
    });
    
    // Create bonus button
    html.find('.create-bonus').click(() => {
      if (this.selectedActor) {
        this.openBonusWorkshop(this.selectedActor);
      } else {
        ui.notifications.warn("Please select an actor first.");
      }
    });
  }

  openBonusWorkshop(actor) {
    debug(`Opening bonus workshop for ${actor.name}`);
    
    const content = `
      <h2>${MODULE_TITLE}</h2>
      <p>This is a simplified version of the module.</p>
      <p>The full functionality is not yet implemented in this version.</p>
      <p>Actor: ${actor.name}</p>
    `;
    
    // Use DialogV2 if available (Foundry VTT 13), otherwise fall back to Dialog
    if (foundry.applications?.api?.DialogV2) {
      new foundry.applications.api.DialogV2({
        title: MODULE_TITLE,
        content: content,
        buttons: {
          close: {
            label: "Close",
            callback: () => debug("Dialog closed")
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
            callback: () => debug("Dialog closed")
          }
        }
      }).render(true);
    }
  }
}

// Add a button to the sidebar to open the standalone interface
function addSidebarButton() {
  if (document.getElementById('enhanced-bonus-builder-button')) return;
  
  const button = document.createElement('button');
  button.id = 'enhanced-bonus-builder-button';
  button.innerHTML = '<i class="fas fa-calculator"></i> Enhanced Bonus Builder';
  button.classList.add('enhanced-bonus-builder-sidebar-button');
  
  // Style the button
  button.style.margin = '5px';
  button.style.padding = '5px 10px';
  button.style.backgroundColor = '#4b6eaf';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '3px';
  button.style.width = '90%';
  button.style.textAlign = 'left';
  
  // Add click handler
  button.addEventListener('click', () => {
    new EnhancedBonusBuilderApp().render(true);
  });
  
  // Find a place to add the button
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const sidebarTools = sidebar.querySelector('#sidebar-tabs .tab[data-tab="settings"]');
    if (sidebarTools) {
      sidebarTools.appendChild(button);
      debug("Added sidebar button");
    } else {
      sidebar.prepend(button);
      debug("Added sidebar button (fallback location)");
    }
  }
}

// Use MutationObserver to detect when actor sheets are rendered
function setupSheetObserver() {
  debug("Setting up MutationObserver for actor sheets");
  
  // Create a MutationObserver to watch for new actor sheets
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if this is an actor sheet
            const isActorSheet = node.classList && 
                                (node.classList.contains('sheet') && node.classList.contains('actor')) ||
                                (node.querySelector('.sheet.actor'));
            
            if (isActorSheet) {
              debug("MutationObserver detected new actor sheet:", node);
              processActorSheet(node);
            }
          }
        }
      }
    }
  });
  
  // Start observing the document body for actor sheets
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Also process any existing actor sheets
  document.querySelectorAll('.app.sheet.actor').forEach(processActorSheet);
}

// Process an actor sheet to add our UI elements
function processActorSheet(sheetElement) {
  // Skip if the setting is disabled
  if (!game.settings.get(MODULE_ID, "showSheetTab")) return;
  
  // Skip if we've already processed this sheet
  if (sheetElement.dataset.ebbProcessed === "true") {
    debug("Sheet already processed:", sheetElement);
    return;
  }
  
  debug("Processing actor sheet:", sheetElement);
  
  try {
    // Mark as processed to avoid duplicate processing
    sheetElement.dataset.ebbProcessed = "true";
    
    // Find the actor ID to get the actor object
    const appId = sheetElement.dataset.appid;
    if (!appId) {
      debug("Could not find appId for sheet:", sheetElement);
      return;
    }
    
    const app = ui.windows[appId];
    if (!app || !app.actor) {
      debug("Could not find app or actor for appId:", appId);
      return;
    }
    
    const actor = app.actor;
    debug("Found actor:", actor.name);
    
    // Find all potential tab containers using multiple selectors for compatibility
    const tabContainers = [
      sheetElement.querySelector('.tabs[data-group="primary"]'),
      sheetElement.querySelector('nav.sheet-tabs'),
      sheetElement.querySelector('.sheet-navigation'),
      sheetElement.querySelector('.tabs'),
      sheetElement.querySelector('.sheet-tabs')
    ].filter(Boolean);
    
    debug(`Found ${tabContainers.length} potential tab containers`);
    
    if (tabContainers.length === 0) {
      debug("No tab containers found in sheet");
      addFloatingButton(sheetElement, actor);
      return;
    }
    
    // Use the first tab container found
    const tabsContainer = tabContainers[0];
    debug("Using tab container:", tabsContainer);
    
    // Check if our tab already exists
    if (sheetElement.querySelector('[data-tab="bonuses"]')) {
      debug("Bonuses tab already exists");
      return;
    }
    
    // Get the structure of existing tabs
    const existingTab = tabsContainer.querySelector('a, button, li');
    let tagName = 'a';
    let className = 'item';
    let dataGroup = 'primary';
    
    if (existingTab) {
      tagName = existingTab.tagName.toLowerCase();
      className = existingTab.className || 'item';
      dataGroup = existingTab.getAttribute('data-group') || 'primary';
      debug(`Existing tab structure: tag=${tagName}, class=${className}, data-group=${dataGroup}`);
    }
    
    // Create a new tab button matching the structure of existing tabs
    const tabButton = document.createElement(tagName);
    tabButton.className = className;
    tabButton.setAttribute('data-tab', 'bonuses');
    if (dataGroup) tabButton.setAttribute('data-group', dataGroup);
    tabButton.innerHTML = '<i class="fas fa-calculator"></i> Enhanced Bonus Builder';
    
    // Append the tab button to the tabs container
    tabsContainer.appendChild(tabButton);
    debug("Tab button added");
    
    // Find all potential sheet body containers
    const bodyContainers = [
      sheetElement.querySelector('.sheet-body'),
      sheetElement.querySelector('.sheet-content'),
      sheetElement.querySelector('.tab-content'),
      sheetElement.querySelector('.sheet-body-content'),
      sheetElement.querySelector('section.sheet-body'),
      sheetElement.querySelector('.sheet-tab-area')
    ].filter(Boolean);
    
    debug(`Found ${bodyContainers.length} potential body containers`);
    
    if (bodyContainers.length === 0) {
      debug("No body containers found in sheet");
      return;
    }
    
    // Use the first body container found
    const sheetBody = bodyContainers[0];
    debug("Using body container:", sheetBody);
    
    // Get the structure of existing tab content
    const existingTabContent = sheetElement.querySelector('.tab');
    let tabContentClass = 'tab';
    let tabContentDataGroup = dataGroup;
    
    if (existingTabContent) {
      tabContentClass = existingTabContent.className || 'tab';
      tabContentDataGroup = existingTabContent.getAttribute('data-group') || dataGroup;
      debug(`Existing tab content structure: class=${tabContentClass}, data-group=${tabContentDataGroup}`);
    }
    
    // Create tab content matching the structure of existing tab content
    const tabContent = document.createElement('div');
    tabContent.className = tabContentClass;
    tabContent.setAttribute('data-tab', 'bonuses');
    if (tabContentDataGroup) tabContent.setAttribute('data-group', tabContentDataGroup);
    tabContent.innerHTML = `
      <div style="padding: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
          <h2 style="margin: 0;">Enhanced Bonus Builder</h2>
          <button type="button" class="ebb-create-bonus" style="background-color: #4b6eaf; color: white; border: none; border-radius: 3px; padding: 5px 10px;">
            <i class="fas fa-plus"></i> Create Bonus
          </button>
        </div>
        <div style="background-color: rgba(0,0,0,0.05); padding: 10px; border-radius: 5px;">
          <p>This is a simplified version of the Enhanced Bonus Builder module.</p>
          <p>The full functionality is not yet implemented in this version.</p>
          <p>Actor: ${actor.name}</p>
        </div>
      </div>
    `;
    
    // Append the tab content to the sheet body
    sheetBody.appendChild(tabContent);
    debug("Tab content added");
    
    // Add click handler for create bonus button
    const createButton = tabContent.querySelector('.ebb-create-bonus');
    if (createButton) {
      createButton.addEventListener('click', () => {
        openBonusWorkshop(actor);
      });
    }
    
    // Try to activate the tab by clicking it
    tabButton.addEventListener('click', function() {
      // Hide all tab content
      const allTabContent = sheetElement.querySelectorAll(`.${tabContentClass}`);
      allTabContent.forEach(tab => {
        tab.style.display = 'none';
      });
      
      // Show our tab content
      tabContent.style.display = 'block';
      
      // Update active state on tab buttons
      const allTabButtons = tabsContainer.querySelectorAll(`.${className}`);
      allTabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Mark our button as active
      this.classList.add('active');
    });
    
    // Try to hook into the app's tab system if available
    if (app._tabs && app._tabs[0]) {
      try {
        app._tabs[0].bind(sheetElement);
        debug("Activated tabs using app._tabs");
      } catch (error) {
        debug("Error activating tabs:", error);
      }
    }
    
    // Force a notification to confirm the tab was added
    ui.notifications.info(`Enhanced Bonus Builder tab added to ${actor.name}'s sheet`);
  } catch (error) {
    console.error(`${MODULE_TITLE} | Error processing sheet:`, error);
  }
}

// Add a floating button to the sheet if we can't add a tab
function addFloatingButton(sheetElement, actor) {
  debug("Adding floating button to sheet for", actor.name);
  
  // Check if button already exists
  if (sheetElement.querySelector('.enhanced-bonus-builder-float-button')) {
    debug("Floating button already exists");
    return;
  }
  
  // Create a floating button
  const button = document.createElement('div');
  button.className = 'enhanced-bonus-builder-float-button';
  button.innerHTML = '<i class="fas fa-calculator"></i>';
  button.title = MODULE_TITLE;
  
  // Style the button
  button.style.position = 'absolute';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.backgroundColor = '#4b6eaf';
  button.style.color = 'white';
  button.style.width = '30px';
  button.style.height = '30px';
  button.style.borderRadius = '50%';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.cursor = 'pointer';
  button.style.zIndex = '100';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  
  // Add click handler
  button.addEventListener('click', () => {
    openBonusWorkshop(actor);
  });
  
  // Add the button to the sheet
  const header = sheetElement.querySelector('.window-header');
  if (header) {
    header.appendChild(button);
    debug("Added floating button to sheet header");
  } else {
    sheetElement.appendChild(button);
    debug("Added floating button to sheet (fallback)");
  }
}

// Simple dialog to simulate the bonus workshop
function openBonusWorkshop(actor) {
  debug(`Opening bonus workshop for ${actor.name}`);
  
  const content = `
    <h2>Enhanced Bonus Builder</h2>
    <p>This is a simplified version of the module.</p>
    <p>The full functionality is not yet implemented in this version.</p>
    <p>Actor: ${actor.name}</p>
  `;
  
  // Use DialogV2 if available (Foundry VTT 13), otherwise fall back to Dialog
  if (foundry.applications?.api?.DialogV2) {
    new foundry.applications.api.DialogV2({
      title: MODULE_TITLE,
      content: content,
      buttons: {
        close: {
          label: "Close",
          callback: () => debug("Dialog closed")
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
          callback: () => debug("Dialog closed")
        }
      }
    }).render(true);
  }
}

// Log when ready
Hooks.once("ready", () => {
  console.log(`${MODULE_TITLE} | Ready`);
  
  // Debug information
  console.log(`${MODULE_TITLE} | Foundry VTT Version: ${game.version}`);
  console.log(`${MODULE_TITLE} | System: ${game.system.id} (${game.system.version})`);
  console.log(`${MODULE_TITLE} | Module Settings:`, {
    showSheetTab: game.settings.get(MODULE_ID, "showSheetTab"),
    showApplied: game.settings.get(MODULE_ID, "showApplied"),
    showOptional: game.settings.get(MODULE_ID, "showOptional"),
    useStandaloneInterface: game.settings.get(MODULE_ID, "useStandaloneInterface"),
    debugMode: game.settings.get(MODULE_ID, "debugMode")
  });
  
  // Add a simple notification to show the module is loaded
  ui.notifications.info(`${MODULE_TITLE} | Module loaded successfully`);
  
  // Setup the MutationObserver to detect actor sheets
  setupSheetObserver();
  
  // Add the sidebar button for the standalone interface
  addSidebarButton();
  
  // Process any existing actor sheets
  document.querySelectorAll('.app.sheet.actor').forEach(processActorSheet);
  
  // Set up a periodic check for actor sheets as a fallback
  setInterval(() => {
    document.querySelectorAll('.app.sheet.actor').forEach(sheet => {
      if (!sheet.dataset.ebbProcessed) {
        debug("Periodic check found unprocessed sheet:", sheet);
        processActorSheet(sheet);
      }
    });
  }, 2000);
});

// Add the button to character sheets
Hooks.on("renderActorSheet", (app, html, data) => {
  // Only apply to DnD5e actor sheets
  if (!app.actor || game.system.id !== "dnd5e") {
    return;
  }
  
  debug(`renderActorSheet hook fired for ${app.actor.name}`);
  
  // Process the sheet
  processActorSheet(html[0].closest('.app.sheet.actor'));
});