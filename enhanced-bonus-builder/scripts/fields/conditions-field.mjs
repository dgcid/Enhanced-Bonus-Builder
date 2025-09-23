import { MODULE } from "../constants.mjs";

export default class ConditionsField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.conditions.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.conditions.hint`,
      ...options
    });
  }
}
