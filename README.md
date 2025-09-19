# Enhanced Bonus Builder

A module for creating and applying conditional bonuses to rolls in the DnD 5e system. This is a replacement for the archived Build-a-Bonus module.

## Features

- Create conditional bonuses for attack rolls, damage rolls, saving throws, ability checks, and hit die rolls
- Apply bonuses automatically based on conditions
- Manage bonuses through a dedicated interface
- Compatible with Foundry VTT versions 11-13

## Installation

1. In the Foundry VTT setup screen, go to "Add-on Modules"
2. Click "Install Module"
3. In the "Manifest URL" field, paste: `https://github.com/yourusername/enhanced-bonus-builder/releases/latest/download/module.json`
4. Click "Install"

## Usage

### Accessing the Module

There are multiple ways to access the Enhanced Bonus Builder:

1. **Character Sheet Tab**: A new tab is added to character sheets labeled "Enhanced Bonus Builder"
2. **Floating Button**: If the tab integration fails, a floating button is added to the character sheet
3. **Sidebar Button**: A button is added to the sidebar for accessing the standalone interface

### Creating Bonuses

1. Open the Enhanced Bonus Builder interface using one of the methods above
2. Click the "Create Bonus" button
3. Fill in the bonus details:
   - Name: A descriptive name for the bonus
   - Type: The type of roll this bonus applies to
   - Value: The bonus value (can be a fixed number or a formula)
   - Conditions: When this bonus should apply

### Managing Bonuses

- Enable/Disable: Toggle bonuses on or off
- Edit: Modify existing bonuses
- Delete: Remove bonuses you no longer need

## Settings

- **Show Sheet Tab**: Enable/disable the character sheet tab integration
- **Show Applied Bonuses**: Show a chat message with the bonuses that were applied to a roll
- **Show Optional Bonuses**: Show a dialog with optional bonuses that can be applied to a roll
- **Use Standalone Interface**: Use a standalone interface instead of integrating with character sheets
- **Debug Mode**: Enable debug logging for troubleshooting

## Troubleshooting

If you encounter issues with the character sheet integration:

1. Try enabling "Use Standalone Interface" in the module settings
2. Check if the debug tools are available by clicking the "EBB Debug Tools" button in the sidebar
3. Use the debug tools to reset processed flags and force process sheets

## Compatibility

- Requires Foundry VTT version 11-13
- Requires DnD 5e system version 5.1.2 or later
- Compatible with most character sheet modules

## License

This module is licensed under the MIT License.