// Enhanced Bonus Builder Test Script
// This script can be pasted into the browser console to test the module

// Function to test if the module is loaded correctly
function testModuleLoading() {
  console.log("Testing module loading...");
  
  // Check if the module is registered
  const module = game.modules.get("enhanced-bonus-builder");
  if (!module) {
    console.error("Module not found in game.modules!");
    return false;
  }
  
  console.log("Module found:", module);
  console.log("Module active:", module.active);
  
  // Check settings
  const settings = {
    showSheetTab: game.settings.get("enhanced-bonus-builder", "showSheetTab"),
    showApplied: game.settings.get("enhanced-bonus-builder", "showApplied"),
    showOptional: game.settings.get("enhanced-bonus-builder", "showOptional"),
    useStandaloneInterface: game.settings.get("enhanced-bonus-builder", "useStandaloneInterface"),
    debugMode: game.settings.get("enhanced-bonus-builder", "debugMode")
  };
  
  console.log("Module settings:", settings);
  
  return true;
}

// Function to test character sheet integration
function testSheetIntegration() {
  console.log("Testing character sheet integration...");
  
  // Find all actor sheets
  const sheets = Object.values(ui.windows).filter(w => w.document?.documentName === "Actor");
  console.log(`Found ${sheets.length} actor sheets`);
  
  if (sheets.length === 0) {
    console.warn("No actor sheets found. Please open a character sheet first.");
    return false;
  }
  
  // Check each sheet for our tab or button
  sheets.forEach((sheet, i) => {
    console.log(`Checking sheet ${i + 1}: ${sheet.document.name}`);
    
    const element = sheet.element[0];
    const hasTab = !!element.querySelector('[data-tab="bonuses"]');
    const hasButton = !!element.querySelector('.enhanced-bonus-builder-float-button');
    
    console.log(`Sheet ${i + 1} has tab:`, hasTab);
    console.log(`Sheet ${i + 1} has button:`, hasButton);
    
    if (!hasTab && !hasButton) {
      console.warn(`Sheet ${i + 1} has no integration!`);
    }
  });
  
  return true;
}

// Function to test standalone interface
function testStandaloneInterface() {
  console.log("Testing standalone interface...");
  
  // Check if the sidebar button exists
  const button = document.getElementById('enhanced-bonus-builder-button');
  if (!button) {
    console.warn("Standalone interface button not found in sidebar!");
    return false;
  }
  
  console.log("Standalone interface button found");
  
  // Try to open the interface
  console.log("Opening standalone interface...");
  button.click();
  
  return true;
}

// Function to run all tests
function runAllTests() {
  console.log("=== ENHANCED BONUS BUILDER TESTS ===");
  
  const moduleLoaded = testModuleLoading();
  if (!moduleLoaded) {
    console.error("Module loading test failed! Aborting further tests.");
    return;
  }
  
  testSheetIntegration();
  testStandaloneInterface();
  
  console.log("=== TESTS COMPLETE ===");
}

// Run the tests
runAllTests();