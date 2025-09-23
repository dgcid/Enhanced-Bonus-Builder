import { MODULE } from "../constants.mjs";

export default class DistanceField extends foundry.data.fields.BooleanField {
  constructor(options = {}) {
    super({
      label: `ENHANCEDBONUSBUILDER.FIELDS.distance.label`,
      hint: `ENHANCEDBONUSBUILDER.FIELDS.distance.hint`,
      ...options
    });
  }
}
