import { MODULE, SPELL_SCHOOLS } from "../constants.mjs";

export default class SpellSchoolField extends foundry.data.fields.StringField {
  constructor(options = {}) {
    super({
      label: "ENHANCEDBONUSBUILDER.FIELDS.spellSchool.label",
      hint: "ENHANCEDBONUSBUILDER.FIELDS.spellSchool.hint",
      choices: SPELL_SCHOOLS.reduce((obj, school) => {
        obj[school] = `DND5E.SpellSchool${school.capitalize()}`;
        return obj;
      }, {}),
      ...options
    });
  }
}