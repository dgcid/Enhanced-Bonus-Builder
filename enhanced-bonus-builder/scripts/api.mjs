import applications from "./applications/_module.mjs";
import models from "./models/_module.mjs";

export default {
  applyMarkers: applyMarkers,
  createBonus: createBonus,
  duplicateBonus: duplicateBonus,
  embedBonus: embedBonus,
  findEmbeddedDocumentsWithBonuses: findEmbeddedDocumentsWithBonuses,
  fromUuid: bonusFromUuid,
  fromUuidSync: bonusFromUuidSync,
  getCollection: getCollection,
  hasArmorProficiency: hasArmorProficiency,
  hasToolProficiency: hasToolProficiency,
  hasWeaponProficiency: hasWeaponProficiency,
  hotbarToggle: hotbarToggle,
  openBonusWorkshop: openBonusWorkshop,
  proficiencyTree: proficiencyTree,
  speaksLanguage: speaksLanguage
};

/**
 * Apply markers to a document for the 'Markers' filter
 * @param {Document} document The target document.
 * @returns {Promise<Document|null>} A promise that resolves to the result of the dialog prompt.
 */
async function applyMarkers(document) {
  const { SetField, StringField } = foundry.data.fields;
  const field = new SetField(new StringField());
  const value = document.getFlag("enhanced-bonus-builder", "markers") ?? [];
  const html = field.toFormGroup({
    label: "ENHANCEDBONUSBUILDER.MarkersDialog.field.label",
    hint: "ENHANCEDBONUSBUILDER.MarkersDialog.field.hint",
    localize: true
  }, {value: value, name: "markers", slug: true}).outerHTML;

  return foundry.applications.api.DialogV2.prompt({
    rejectClose: false,
    title: "ENHANCEDBONUSBUILDER.MarkersDialog.title",
    content: html,
    buttons: {
      submit: {
        label: "ENHANCEDBONUSBUILDER.MarkersDialog.submit",
        icon: "fas fa-check",
        callback: async (html) => {
          const form = html.querySelector("form");
          const fd = new FormDataExtended(form);
          const markers = fd.object.markers ?? [];
          return document.setFlag("enhanced-bonus-builder", "markers", markers);
        }
      },
      cancel: {
        label: "ENHANCEDBONUSBUILDER.MarkersDialog.cancel",
        icon: "fas fa-times"
      }
    }
  });
}

/**
 * Create a new bonus for a document.
 * @param {Document} document The document to create the bonus for.
 * @param {string} type The type of bonus to create.
 * @param {object} [data={}] Initial data for the bonus.
 * @returns {models.Babonus} The created bonus.
 */
function createBonus(document, type, data = {}) {
  const Model = models[type];
  if (!Model) throw new Error(`Invalid bonus type: ${type}`);
  
  const id = foundry.utils.randomID();
  const bonus = new Model({
    id,
    name: game.i18n.localize("ENHANCEDBONUSBUILDER.NewBonus"),
    type,
    ...data
  }, {parent: document});
  
  return bonus;
}

/**
 * Duplicate an existing bonus.
 * @param {models.Babonus} bonus The bonus to duplicate.
 * @returns {models.Babonus} The duplicated bonus.
 */
function duplicateBonus(bonus) {
  const data = foundry.utils.deepClone(bonus.toObject());
  data.id = foundry.utils.randomID();
  data.name = `${data.name} (${game.i18n.localize("ENHANCEDBONUSBUILDER.Copy")})`;
  
  const Model = models[bonus.type];
  return new Model(data, {parent: bonus.parent});
}

/**
 * Embed a bonus in a document.
 * @param {Document} document The document to embed the bonus in.
 * @param {models.Babonus} bonus The bonus to embed.
 * @returns {Promise<Document>} The updated document.
 */
async function embedBonus(document, bonus) {
  const bonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  bonuses[bonus.id] = bonus.toObject();
  
  return document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
}

/**
 * Find all embedded documents with bonuses.
 * @param {Actor} actor The actor to search.
 * @returns {Document[]} The embedded documents with bonuses.
 */
function findEmbeddedDocumentsWithBonuses(actor) {
  const documents = [];
  
  // Check actor
  if (actor.getFlag("enhanced-bonus-builder", "bonuses")) {
    documents.push(actor);
  }
  
  // Check items
  for (const item of actor.items) {
    if (item.getFlag("enhanced-bonus-builder", "bonuses")) {
      documents.push(item);
    }
  }
  
  // Check effects
  for (const effect of actor.effects) {
    if (effect.getFlag("enhanced-bonus-builder", "bonuses")) {
      documents.push(effect);
    }
  }
  
  return documents;
}

/**
 * Get a bonus from a UUID.
 * @param {string} uuid The UUID of the document.
 * @param {string} bonusId The ID of the bonus.
 * @returns {Promise<models.Babonus|null>} The bonus, or null if not found.
 */
async function bonusFromUuid(uuid, bonusId) {
  const document = await fromUuid(uuid);
  if (!document) return null;
  
  const bonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  const data = bonuses[bonusId];
  if (!data) return null;
  
  const Model = models[data.type];
  if (!Model) return null;
  
  return new Model(data, {parent: document});
}

/**
 * Get a bonus from a UUID synchronously.
 * @param {string} uuid The UUID of the document.
 * @param {string} bonusId The ID of the bonus.
 * @returns {models.Babonus|null} The bonus, or null if not found.
 */
function bonusFromUuidSync(uuid, bonusId) {
  const document = fromUuidSync(uuid);
  if (!document) return null;
  
  const bonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  const data = bonuses[bonusId];
  if (!data) return null;
  
  const Model = models[data.type];
  if (!Model) return null;
  
  return new Model(data, {parent: document});
}

/**
 * Get a collection of bonuses for a document.
 * @param {Document} document The document to get bonuses for.
 * @returns {applications.BonusCollection} The collection of bonuses.
 */
function getCollection(document) {
  return new applications.BonusCollection(document);
}

/**
 * Check if an actor has proficiency with an armor.
 * @param {Actor} actor The actor to check.
 * @param {Item} item The armor item.
 * @returns {boolean} Whether the actor has proficiency.
 */
function hasArmorProficiency(actor, item) {
  if (!actor || !item || item.type !== "equipment" || item.system.armor?.type === "shield") {
    return false;
  }
  
  const armorProf = actor.system.traits?.armorProf ?? {};
  const armor = item.system.armor?.type;
  
  if (!armor || armorProf.value?.includes(armor)) return true;
  
  // Check custom proficiencies
  if (armorProf.custom) {
    const custom = armorProf.custom.toLowerCase();
    const name = item.name.toLowerCase();
    return custom.split(";").some(c => name.includes(c.trim()));
  }
  
  return false;
}

/**
 * Check if an actor has proficiency with a tool.
 * @param {Actor} actor The actor to check.
 * @param {Item} item The tool item.
 * @returns {boolean} Whether the actor has proficiency.
 */
function hasToolProficiency(actor, item) {
  if (!actor || !item || item.type !== "tool") return false;
  
  const toolProf = actor.system.traits?.toolProf ?? {};
  const tool = item.system.toolType;
  
  if (toolProf.value?.includes(tool)) return true;
  
  // Check custom proficiencies
  if (toolProf.custom) {
    const custom = toolProf.custom.toLowerCase();
    const name = item.name.toLowerCase();
    return custom.split(";").some(c => name.includes(c.trim()));
  }
  
  return false;
}

/**
 * Check if an actor has proficiency with a weapon.
 * @param {Actor} actor The actor to check.
 * @param {Item} item The weapon item.
 * @returns {boolean} Whether the actor has proficiency.
 */
function hasWeaponProficiency(actor, item) {
  if (!actor || !item || item.type !== "weapon") return false;
  
  const weaponProf = actor.system.traits?.weaponProf ?? {};
  const weapon = item.system.weaponType;
  
  if (weaponProf.value?.includes(weapon)) return true;
  
  // Check for simple/martial proficiency
  const isMartial = item.system.properties?.mar;
  const isSimple = !isMartial;
  
  if ((isSimple && weaponProf.value?.includes("sim")) || 
      (isMartial && weaponProf.value?.includes("mar"))) {
    return true;
  }
  
  // Check custom proficiencies
  if (weaponProf.custom) {
    const custom = weaponProf.custom.toLowerCase();
    const name = item.name.toLowerCase();
    return custom.split(";").some(c => name.includes(c.trim()));
  }
  
  return false;
}

/**
 * Toggle a bonus on the hotbar.
 * @param {string} uuid The UUID of the document.
 * @param {string} bonusId The ID of the bonus.
 * @returns {Promise<boolean>} Whether the bonus was toggled.
 */
async function hotbarToggle(uuid, bonusId) {
  const bonus = await bonusFromUuid(uuid, bonusId);
  if (!bonus) return false;
  
  const enabled = !bonus.enabled;
  const bonuses = bonus.parent.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
  bonuses[bonusId].enabled = enabled;
  
  await bonus.parent.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
  
  // Show notification
  const status = enabled ? "ENHANCEDBONUSBUILDER.Enabled" : "ENHANCEDBONUSBUILDER.Disabled";
  ui.notifications.info(`${bonus.name}: ${game.i18n.localize(status)}`);
  
  return true;
}

/**
 * Open the bonus workshop for a document.
 * @param {Document} document The document to open the workshop for.
 * @returns {applications.BabonusWorkshop} The workshop application.
 */
function openBonusWorkshop(document) {
  const workshop = new applications.BabonusWorkshop(document);
  workshop.render(true);
  return workshop;
}

/**
 * Get the proficiency tree for an actor.
 * @param {Actor} actor The actor to get the proficiency tree for.
 * @returns {object} The proficiency tree.
 */
function proficiencyTree(actor) {
  if (!actor) return {};
  
  const tree = {};
  const traits = actor.system.traits ?? {};
  
  // Armor proficiencies
  tree.armor = {};
  if (traits.armorProf?.value) {
    for (const prof of traits.armorProf.value) {
      tree.armor[prof] = true;
    }
  }
  
  // Weapon proficiencies
  tree.weapon = {};
  if (traits.weaponProf?.value) {
    for (const prof of traits.weaponProf.value) {
      tree.weapon[prof] = true;
    }
  }
  
  // Tool proficiencies
  tree.tool = {};
  if (traits.toolProf?.value) {
    for (const prof of traits.toolProf.value) {
      tree.tool[prof] = true;
    }
  }
  
  return tree;
}

/**
 * Check if an actor speaks a language.
 * @param {Actor} actor The actor to check.
 * @param {string} language The language to check.
 * @returns {boolean} Whether the actor speaks the language.
 */
function speaksLanguage(actor, language) {
  if (!actor || !language) return false;
  
  const langs = actor.system.traits?.languages ?? {};
  
  if (langs.value?.includes(language)) return true;
  
  // Check custom languages
  if (langs.custom) {
    const custom = langs.custom.toLowerCase();
    language = language.toLowerCase();
    return custom.split(";").some(l => l.trim() === language);
  }
  
  return false;
}