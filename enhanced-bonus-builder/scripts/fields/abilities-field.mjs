import { MODULE, ABILITY_TYPES } from "../constants.mjs";

export default class AbilitiesField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      choices: ABILITY_TYPES.reduce((obj, ability) => {
        obj[ability] = `DND5E.Ability${ability.capitalize()}`;
        return obj;
      }, {}),
      label: "ENHANCEDBONUSBUILDER.FIELDS.abilities.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.abilities.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.abilities.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.abilities.hint",
      ...options
    });
  }
}