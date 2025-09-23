import { MODULE } from "../constants.mjs";

export default class ConcentrationField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.concentration.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.concentration.hint`,
      ...options
    });
  }
}
