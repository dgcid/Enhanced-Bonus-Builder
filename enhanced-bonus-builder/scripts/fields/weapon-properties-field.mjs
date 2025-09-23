import { MODULE, WEAPON_PROPERTIES } from "../constants.mjs";

export default class WeaponPropertiesField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      choices: WEAPON_PROPERTIES.reduce((obj, wp) => {
        obj[wp] = `ENHANCEDBONUSBUILDER.WEAPONPROPERTIES.${wp}`;
        return obj;
      }, {}),
      label: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.weaponProperties.hint",
      ...options
    });
  }
}