# Enhanced Bonus Builder

A module for Foundry VTT that allows you to create and apply conditional bonuses to rolls in the DnD 5e system. This is a replacement for the archived Build-a-Bonus module.

## Features

Enhanced Bonus Builder allows you to create bonuses that apply to:
- Attack rolls
- Damage rolls
- Saving throw DCs
- Saving throws
- Ability checks
- Hit die rolls

These bonuses can be filtered to apply only under specific circumstances, such as:
- Only for specific damage types
- Only for specific item types
- Only for specific spell components
- Only for specific weapon properties
- Only when certain conditions are met
- And many more!

## How to Use

Open any actor's sheet, any item sheet, or any effect config, then click the bonus icon in the header. Choose the type of bonus you want to create, then fill out the name, description, and the bonus. Then start narrowing down when and how the bonus should apply, using the available filters.

As of Foundry VTT version 12, Enhanced Bonus Builder also supports adding bonuses to Scene Regions. A button for this can be found in the region's sheet.

## Examples

### Alchemical Savant (Artificer Feature)
Add intelligence modifier to damage rolls of all spell-type items, but only if the spell deals acid, fire, necrotic, poison, or healing damage, and only if it has a material (M) component.

### Divination Savant (Wizard Feature)
Give your wizard player a bonus to the saving throw DC with just divination spells, and make the bonus equal to the level of the spell.

### Magical Pugilist
Create a feature similar to Brutal Critical that applies only to melee spell attacks.

### Paladin's Aura
Create an aura that grants each enemy within 10 feet a -2 to melee attack rolls.

### Rogue's Magic Item
Create a magic item that creates a 15-foot radius template, inside which everyone gets a damage roll bonus equal to the rogue's sneak attack dice.

## Installation

1. In the Foundry VTT setup screen, go to the "Add-on Modules" tab
2. Click "Install Module"
3. Search for "Enhanced Bonus Builder" or paste the following manifest URL:
   `https://github.com/yourusername/enhanced-bonus-builder/releases/latest/download/module.json`
4. Click "Install"

## License

This module is licensed under the MIT License.

## Acknowledgements

This module is inspired by the original Build-a-Bonus module created by Zhell, which was archived in November 2024.