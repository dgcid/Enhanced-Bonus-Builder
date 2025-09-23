import { MODULE } from "../constants.mjs";

export default class ProficiencyField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.proficiency.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.proficiency.hint",
      choices: {
        proficient: "DND5E.ProficiencyLevel1",
        expert: "DND5E.ProficiencyLevel2"
      },
      ...options
    });
  }
}