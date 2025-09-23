import { MODULE } from "../constants.mjs";

export default class RitualField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.ritual.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.ritual.hint`,
      ...options
    });
  }
}
