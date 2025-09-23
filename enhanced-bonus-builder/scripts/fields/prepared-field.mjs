import { MODULE } from "../constants.mjs";

export default class PreparedField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.prepared.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.prepared.hint`,
      ...options
    });
  }
}
