# Enhanced Bonus Builder - Implementation Guide

This guide provides step-by-step instructions for implementing and testing the Enhanced Bonus Builder module in Foundry VTT 13.

## Implementation Steps

### 1. Update Module Files

1. **Replace main.js**:
   - Use the new main.js file we created, which includes:
     - MutationObserver for reliable sheet detection
     - Multiple integration methods (tab, floating button, standalone interface)
     - Debug tools and logging

2. **Add Templates**:
   - Add the standalone-app.html template to the templates directory

3. **Update CSS**:
   - Add the enhanced-bonus-builder.css file to the styles directory

4. **Update module.json**:
   - Update the module.json to point to the new files
   - Change the script entry to use main.js instead of hooks.mjs

### 2. Install the Module

1. **Copy Files**:
   - Copy all updated files to your Foundry VTT modules directory
   - Ensure the directory structure matches the module.json

2. **Restart Foundry VTT**:
   - Restart your Foundry VTT server to load the updated module

3. **Enable the Module**:
   - In Foundry VTT, go to "Manage Modules"
   - Enable the "Enhanced Bonus Builder" module

### 3. Configure Settings

1. **Access Settings**:
   - Go to "Configure Settings" > "Module Settings"
   - Find the "Enhanced Bonus Builder" section

2. **Adjust Settings**:
   - **Show Sheet Tab**: Enable/disable the character sheet tab integration
   - **Show Applied Bonuses**: Show a chat message with applied bonuses
   - **Show Optional Bonuses**: Show a dialog with optional bonuses
   - **Use Standalone Interface**: Use the standalone interface instead of sheet integration
   - **Debug Mode**: Enable debug logging for troubleshooting

## Testing Procedure

### 1. Basic Functionality Test

1. **Check Module Loading**:
   - Open the browser console (F12)
   - Verify that the module initialization messages appear
   - Check for any error messages

2. **Check Settings**:
   - Verify that all module settings are available
   - Test changing settings and observe the effects

### 2. Character Sheet Integration Test

1. **Open Character Sheets**:
   - Open at least two different character sheets
   - Verify that the "Enhanced Bonus Builder" tab appears in each sheet
   - If the tab doesn't appear, check for a floating button in the sheet header

2. **Test Tab Functionality**:
   - Click the "Enhanced Bonus Builder" tab
   - Verify that the tab content appears
   - Test the "Create Bonus" button

### 3. Standalone Interface Test

1. **Open Standalone Interface**:
   - Click the "Enhanced Bonus Builder" button in the sidebar
   - Verify that the standalone interface opens

2. **Test Actor Selection**:
   - Select different actors from the dropdown
   - Verify that the interface updates accordingly

3. **Test Create Bonus**:
   - Click the "Create Bonus" button
   - Verify that the bonus workshop dialog opens

### 4. Debug Tools Test

1. **Access Debug Tools**:
   - Click the "EBB Debug Tools" button in the sidebar
   - Verify that the debug dialog opens

2. **Test Debug Functions**:
   - Click "Dump Sheet Info" and check the output
   - Click "Reset Processed Flags" and verify that it works
   - Click "Force Process Sheets" and check if sheets are processed

### 5. Console Testing

1. **Run Test Script**:
   - Open the browser console (F12)
   - Copy and paste the content of test_script.js
   - Check the test results

## Troubleshooting

### Common Issues and Solutions

1. **Tab Not Appearing**:
   - Enable "Debug Mode" in settings
   - Check the console for error messages
   - Use the debug tools to force process sheets
   - Try enabling "Use Standalone Interface" as a fallback

2. **Standalone Interface Not Working**:
   - Check if the sidebar button appears
   - Check the console for error messages
   - Try reloading the page

3. **No Integration Methods Working**:
   - Check if the module is properly installed and enabled
   - Check for JavaScript errors in the console
   - Try reinstalling the module

### Getting Help

If you encounter issues that you cannot resolve:

1. Check the module's GitHub repository for known issues
2. Join the Foundry VTT Discord server and ask for help in the #modules channel
3. Submit a bug report on the GitHub repository with detailed information about the issue

## Next Steps

Once basic integration is working:

1. Implement the full bonus creation and management functionality
2. Add support for different bonus types
3. Implement the roll modification hooks
4. Create a proper release with full documentation