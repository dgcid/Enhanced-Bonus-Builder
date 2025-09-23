import { MODULE } from "../constants.mjs";

export default class AttunementField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.attunement.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.attunement.hint`,
      ...options
    });
  }
}
