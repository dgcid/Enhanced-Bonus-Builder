import { MODULE, SKILL_TYPES } from "../constants.mjs";

export default class SkillsField extends foundry.data.fields.SetField {
  constructor(options = {}) {
    const stringField = new foundry.data.fields.StringField({
      choices: SKILL_TYPES.reduce((obj, skill) => {
        obj[skill] = `DND5E.Skill${skill.capitalize()}`;
        return obj;
      }, {}),
      label: "ENHANCEDBONUSBUILDER.FIELDS.skills.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.skills.hint"
    });
    
    super(stringField, {
      label: "ENHANCEDBONUSBUILDER.FIELDS.skills.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.skills.hint",
      ...options
    });
  }
}