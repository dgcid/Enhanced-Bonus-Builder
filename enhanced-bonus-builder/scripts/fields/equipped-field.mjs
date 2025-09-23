import { MODULE } from "../constants.mjs";

export default class EquippedField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.equipped.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.equipped.hint`,
      ...options
    });
  }
}
