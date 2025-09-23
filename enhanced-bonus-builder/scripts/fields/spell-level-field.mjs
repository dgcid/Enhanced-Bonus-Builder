import { MODULE } from "../constants.mjs";

export default class SpellLevelField extends foundry.data.fields.NumberField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.spellLevel.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.spellLevel.hint",
      min: 0,
      max: 9,
      step: 1,
      ...options
    });
  }
}