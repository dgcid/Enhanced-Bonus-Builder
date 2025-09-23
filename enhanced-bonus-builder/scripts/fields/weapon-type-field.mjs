import { MODULE } from "../constants.mjs";

export default class WeaponTypeField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.weaponType.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.weaponType.hint",
      choices: {
        simpleM: "DND5E.WeaponSimpleM",
        simpleR: "DND5E.WeaponSimpleR",
        martialM: "DND5E.WeaponMartialM",
        martialR: "DND5E.WeaponMartialR",
        natural: "DND5E.WeaponNatural",
        improvised: "DND5E.WeaponImprovised"
      },
      ...options
    });
  }
}