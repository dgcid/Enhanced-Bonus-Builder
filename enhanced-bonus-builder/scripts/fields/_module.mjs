import ItemTypeField from "./item-type-field.mjs";
import WeaponTypeField from "./weapon-type-field.mjs";
import WeaponPropertiesField from "./weapon-properties-field.mjs";
import ArmorTypeField from "./armor-type-field.mjs";
import SpellLevelField from "./spell-level-field.mjs";
import SpellSchoolField from "./spell-school-field.mjs";
import SpellComponentsField from "./spell-components-field.mjs";
import DamageTypesField from "./damage-types-field.mjs";
import AbilitiesField from "./abilities-field.mjs";
import SkillsField from "./skills-field.mjs";
import ProficiencyField from "./proficiency-field.mjs";
import MarkersField from "./markers-field.mjs";
import ConditionsField from "./conditions-field.mjs";
import DistanceField from "./distance-field.mjs";
import EquippedField from "./equipped-field.mjs";
import AttunementField from "./attunement-field.mjs";
import PreparedField from "./prepared-field.mjs";
import ConcentrationField from "./concentration-field.mjs";
import RitualField from "./ritual-field.mjs";
import CriticalField from "./critical-field.mjs";

export default {
  itemType: new ItemTypeField(),
  weaponType: new WeaponTypeField(),
  weaponProperties: new WeaponPropertiesField(),
  armorType: new ArmorTypeField(),
  spellLevel: new SpellLevelField(),
  spellSchool: new SpellSchoolField(),
  spellComponents: new SpellComponentsField(),
  damageTypes: new DamageTypesField(),
  abilities: new AbilitiesField(),
  skills: new SkillsField(),
  proficiency: new ProficiencyField(),
  markers: new MarkersField(),
  conditions: new ConditionsField(),
  distance: new DistanceField(),
  equipped: new EquippedField(),
  attunement: new AttunementField(),
  prepared: new PreparedField(),
  concentration: new ConcentrationField(),
  ritual: new RitualField(),
  critical: new CriticalField()
};