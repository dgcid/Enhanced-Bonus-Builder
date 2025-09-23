import { MODULE } from "../constants.mjs";

export default class MarkersField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      label: "ENHANCEDBONUSBUILDER.FIELDS.markers.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.markers.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.markers.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.markers.hint",
      ...options
    });
  }
}