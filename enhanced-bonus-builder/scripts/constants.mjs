/**
 * Constants used throughout the Enhanced Bonus Builder module
 */

export const MODULE = {
  ID: "enhanced-bonus-builder",
  NAME: "Enhanced Bonus Builder",
  TITLE: "ENHANCEDBONUSBUILDER.ModuleTitle",
  ICON: "fa-solid fa-calculator"
};

export const SETTINGS = {
  MIGRATE: "migrate",
  SHOW_APPLIED: "showApplied",
  SHOW_OPTIONAL: "showOptional",
  SHOW_SHEET_TAB: "showSheetTab"
};

export const BONUS_TYPES = {
  ATTACK_ROLL: "attackRoll",
  DAMAGE_ROLL: "damageRoll",
  SAVING_THROW_DC: "savingThrowDc",
  SAVING_THROW: "savingThrow",
  ABILITY_CHECK: "abilityCheck",
  HIT_DIE: "hitDie"
};

export const DAMAGE_TYPES = [
  "acid", "bludgeoning", "cold", "fire", "force", 
  "lightning", "necrotic", "piercing", "poison", 
  "psychic", "radiant", "slashing", "thunder",
  "healing"
];

export const SPELL_COMPONENTS = {
  VERBAL: "v",
  SOMATIC: "s",
  MATERIAL: "m"
};

export const WEAPON_PROPERTIES = [
  "ada", "amm", "fin", "fir", "foc", "hvy", "lgt", 
  "lod", "mgc", "rch", "rel", "ret", "sil", "spc", 
  "thr", "two", "ver"
];

export const ITEM_TYPES = [
  "weapon", "equipment", "consumable", "tool", 
  "loot", "background", "class", "subclass", 
  "spell", "feat", "backpack"
];

export const SPELL_SCHOOLS = [
  "abj", "con", "div", "enc", "evo", "ill", "nec", "trs"
];

export const ABILITY_TYPES = [
  "str", "dex", "con", "int", "wis", "cha"
];

export const SKILL_TYPES = [
  "acr", "ani", "arc", "ath", "dec", "his", 
  "ins", "itm", "inv", "med", "nat", "prc", 
  "prf", "per", "rel", "slt", "ste", "sur"
];

export const TEMPLATES = {
  SHEET: `modules/${MODULE.ID}/templates/babonus-sheet.hbs`,
  WORKSHOP: `modules/${MODULE.ID}/templates/babonus-workshop.hbs`,
  SHEET_DESCRIPTION: `modules/${MODULE.ID}/templates/sheet-description.hbs`,
  SHEET_CONFIGURATION: `modules/${MODULE.ID}/templates/sheet-configuration.hbs`,
  SHEET_FILTERS: `modules/${MODULE.ID}/templates/sheet-filters.hbs`,
  SHEET_ADVANCED: `modules/${MODULE.ID}/templates/sheet-advanced.hbs`,
  SHEET_BONUSES: `modules/${MODULE.ID}/templates/sheet-bonuses.hbs`,
  APPLIED_BONUSES: `modules/${MODULE.ID}/templates/subapplications/applied-bonuses.hbs`,
  OPTIONAL_BONUSES: `modules/${MODULE.ID}/templates/subapplications/optional-bonuses.hbs`
};