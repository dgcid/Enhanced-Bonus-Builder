import { MODULE } from "../constants.mjs";

export default class ArmorTypeField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.armorType.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.armorType.hint",
      choices: {
        light: "DND5E.ArmorLight",
        medium: "DND5E.ArmorMedium",
        heavy: "DND5E.ArmorHeavy",
        shield: "DND5E.EquipmentShield"
      },
      ...options
    });
  }
}