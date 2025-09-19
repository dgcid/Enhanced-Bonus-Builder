// Enhanced Bonus Builder Debug Script
console.log("ENHANCED BONUS BUILDER DEBUG SCRIPT LOADED");

// Add a notification when Foundry is ready
Hooks.once('ready', function() {
  console.log("ENHANCED BONUS BUILDER - FOUNDRY IS READY");
  ui.notifications.info("Enhanced Bonus Builder debug script is loaded!");
  
  // Add a debug button to the sidebar
  addDebugButton();
});

// Function to add a debug button to the sidebar
function addDebugButton() {
  try {
    // Create a button element
    const button = document.createElement('button');
    button.textContent = 'EBB Debug Tools';
    button.style.margin = '5px';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#e74c3c';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.width = '90%';
    
    // Add click handler
    button.addEventListener('click', () => {
      showDebugDialog();
    });
    
    // Find a place to add the button
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.prepend(button);
      console.log("Added debug button to sidebar");
    }
  } catch (error) {
    console.error("Error adding debug button:", error);
  }
}

// Function to show a debug dialog
function showDebugDialog() {
  const content = `
    <h2>Enhanced Bonus Builder Debug Tools</h2>
    <div style="margin-bottom: 10px;">
      <button id="ebb-dump-sheets" style="background-color: #3498db; color: white; border: none; border-radius: 3px; padding: 5px 10px; margin: 5px;">
        Dump Sheet Info
      </button>
      <button id="ebb-reset-sheets" style="background-color: #e74c3c; color: white; border: none; border-radius: 3px; padding: 5px 10px; margin: 5px;">
        Reset Processed Flags
      </button>
      <button id="ebb-force-process" style="background-color: #2ecc71; color: white; border: none; border-radius: 3px; padding: 5px 10px; margin: 5px;">
        Force Process Sheets
      </button>
    </div>
    <div id="ebb-debug-output" style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; height: 300px; overflow-y: auto; font-family: monospace;">
      Debug output will appear here...
    </div>
  `;
  
  // Create the dialog
  const dialog = new Dialog({
    title: "Enhanced Bonus Builder Debug",
    content: content,
    buttons: {
      close: {
        label: "Close"
      }
    },
    render: html => {
      // Add event listeners to buttons
      html.find('#ebb-dump-sheets').click(() => {
        const output = dumpActorSheets();
        html.find('#ebb-debug-output').html(output);
      });
      
      html.find('#ebb-reset-sheets').click(() => {
        const output = resetProcessedFlags();
        html.find('#ebb-debug-output').html(output);
      });
      
      html.find('#ebb-force-process').click(() => {
        const output = forceProcessSheets();
        html.find('#ebb-debug-output').html(output);
      });
    }
  });
  
  dialog.render(true);
}

// Function to dump information about actor sheets
function dumpActorSheets() {
  console.log("Dumping actor sheet information");
  let output = "<strong>Actor Sheet Information:</strong><br>";
  
  // Find all elements that look like actor sheets
  const sheetElements = document.querySelectorAll('.app.sheet.actor');
  output += `Found ${sheetElements.length} actor sheet elements in DOM<br><br>`;
  
  // Log details about each sheet element
  sheetElements.forEach((el, index) => {
    output += `<strong>Sheet ${index}:</strong><br>`;
    output += `ID: ${el.id}<br>`;
    output += `Classes: ${el.className}<br>`;
    output += `App ID: ${el.dataset.appid}<br>`;
    output += `Processed: ${el.dataset.ebbProcessed || 'No'}<br>`;
    output += `Title: ${el.querySelector('.window-title')?.textContent || 'Unknown'}<br>`;
    
    // Check for tabs
    const tabContainers = [
      el.querySelector('.tabs[data-group="primary"]'),
      el.querySelector('nav.sheet-tabs'),
      el.querySelector('.sheet-navigation'),
      el.querySelector('.tabs'),
      el.querySelector('.sheet-tabs')
    ].filter(Boolean);
    
    output += `Tab containers: ${tabContainers.length}<br>`;
    
    // Check for sheet body
    const bodyContainers = [
      el.querySelector('.sheet-body'),
      el.querySelector('.sheet-content'),
      el.querySelector('.tab-content'),
      el.querySelector('.sheet-body-content'),
      el.querySelector('section.sheet-body'),
      el.querySelector('.sheet-tab-area')
    ].filter(Boolean);
    
    output += `Body containers: ${bodyContainers.length}<br>`;
    
    // Check if our tab exists
    const bonusTab = el.querySelector('[data-tab="bonuses"]');
    output += `Bonus tab exists: ${bonusTab ? 'Yes' : 'No'}<br><br>`;
  });
  
  return output;
}

// Function to reset processed flags
function resetProcessedFlags() {
  console.log("Resetting processed flags");
  let output = "<strong>Resetting Processed Flags:</strong><br>";
  
  // Find all elements that look like actor sheets
  const sheetElements = document.querySelectorAll('.app.sheet.actor');
  output += `Found ${sheetElements.length} actor sheet elements<br><br>`;
  
  // Reset processed flag for each sheet
  sheetElements.forEach((el, index) => {
    const wasProcessed = el.dataset.ebbProcessed || 'No';
    delete el.dataset.ebbProcessed;
    output += `Sheet ${index}: ${wasProcessed} -> No<br>`;
  });
  
  output += "<br>All processed flags have been reset.";
  return output;
}

// Function to force process sheets
function forceProcessSheets() {
  console.log("Forcing sheet processing");
  let output = "<strong>Forcing Sheet Processing:</strong><br>";
  
  // Reset processed flags first
  resetProcessedFlags();
  
  // Find all elements that look like actor sheets
  const sheetElements = document.querySelectorAll('.app.sheet.actor');
  output += `Found ${sheetElements.length} actor sheet elements<br><br>`;
  
  // Process each sheet
  sheetElements.forEach((el, index) => {
    try {
      output += `Processing sheet ${index}...<br>`;
      
      // Call the processActorSheet function if it exists
      if (typeof processActorSheet === 'function') {
        processActorSheet(el);
        output += `Sheet ${index} processed using module function<br>`;
      } else {
        // Fallback to basic processing
        el.dataset.ebbProcessed = "true";
        
        // Find tab container
        const tabContainers = [
          el.querySelector('.tabs[data-group="primary"]'),
          el.querySelector('nav.sheet-tabs'),
          el.querySelector('.sheet-navigation'),
          el.querySelector('.tabs'),
          el.querySelector('.sheet-tabs')
        ].filter(Boolean);
        
        if (tabContainers.length > 0) {
          const tabsContainer = tabContainers[0];
          
          // Create a tab button
          const tabButton = document.createElement('a');
          tabButton.className = 'item';
          tabButton.setAttribute('data-tab', 'bonuses');
          tabButton.innerHTML = '<i class="fas fa-calculator"></i> Enhanced Bonus Builder';
          
          // Append the tab button
          tabsContainer.appendChild(tabButton);
          output += `Added tab button to sheet ${index}<br>`;
          
          // Find body container
          const bodyContainers = [
            el.querySelector('.sheet-body'),
            el.querySelector('.sheet-content'),
            el.querySelector('.tab-content'),
            el.querySelector('.sheet-body-content'),
            el.querySelector('section.sheet-body'),
            el.querySelector('.sheet-tab-area')
          ].filter(Boolean);
          
          if (bodyContainers.length > 0) {
            const sheetBody = bodyContainers[0];
            
            // Create tab content
            const tabContent = document.createElement('div');
            tabContent.className = 'tab';
            tabContent.setAttribute('data-tab', 'bonuses');
            tabContent.innerHTML = `
              <div style="padding: 10px;">
                <h2>Enhanced Bonus Builder</h2>
                <p>This is a debug version of the tab.</p>
              </div>
            `;
            
            // Append the tab content
            sheetBody.appendChild(tabContent);
            output += `Added tab content to sheet ${index}<br>`;
          } else {
            output += `No body container found for sheet ${index}<br>`;
          }
        } else {
          output += `No tab container found for sheet ${index}<br>`;
        }
      }
    } catch (error) {
      output += `Error processing sheet ${index}: ${error.message}<br>`;
      console.error(`Error processing sheet ${index}:`, error);
    }
  });
  
  output += "<br>Sheet processing complete.";
  return output;
}

// Add global functions for console debugging
window.dumpActorSheets = function() {
  console.log(dumpActorSheets().replace(/<br>/g, '\n'));
  return "Check console for output";
};

window.resetProcessedFlags = function() {
  console.log(resetProcessedFlags().replace(/<br>/g, '\n'));
  return "Processed flags reset";
};

window.forceProcessSheets = function() {
  console.log(forceProcessSheets().replace(/<br>/g, '\n'));
  return "Sheets processed";
};