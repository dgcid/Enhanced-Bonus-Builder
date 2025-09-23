import { MODULE } from "../constants.mjs";

export default class CriticalField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.critical.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.critical.hint`,
      ...options
    });
  }
}
