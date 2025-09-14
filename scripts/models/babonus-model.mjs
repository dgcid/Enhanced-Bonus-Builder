import fields from "../fields/_module.mjs";
import AuraModel from "./aura-model.mjs";
import ConsumptionModel from "./consumption-model.mjs";
import ModifiersModel from "./modifiers-model.mjs";

const {
  BooleanField, DocumentIdField, EmbeddedDataField,
  FilePathField, HTMLField, IntegerSortField,
  ObjectField, SchemaField, SetField, StringField
} = foundry.data.fields;

/**
 * Configuration for how a bonus consumes a property.
 *
 * @typedef {object} ConsumptionModel
 * @property {boolean} enabled Whether the bonus consumes a property.
 * @property {boolean} scales Whether the bonus scales with its consumed property
 * @property {string} type The type of the consumed property.
 * @property {object} value
 * @property {string} value.min The minimum amount the bonus consumes
 * @property {string} value.max The maximum amount the bonus consumes
 * @property {number} value.step The interval size between the min and max
 * @property {string} formula The formula used to scale up the bonus.
 */

/**
 * Configuration for the aura properties of a bonus.
 *
 * @typedef {object} AuraModel
 * @property {boolean} enabled Whether the bonus is an aura
 * @property {boolean} template Whether the bonus is an aura on a template.
 * @property {string} range The range of the aura.
 * @property {boolean} self Whether the aura can also affect its owner
 * @property {number} disposition The type of actors, by token disposition, to affect with the aura.
 * @property {Set<string>} blockers Statuses that disable this aura when its owner is affected.
 * @property {object} require
 * @property {boolean} require.move Whether the aura requires a direct, unobstructed path of movement.
 * @property {boolean} require.sight Whether the aura requires a direct line of sight.
 */

/**
 * Configuration for the modifiers of a bonus.
 *
 * @typedef {object} ModifiersModel
 * @property {boolean} enabled Whether the bonus has modifiers.
 * @property {string} formula The formula used to calculate the modifier.
 * @property {string} target The target of the modifier.
 * @property {string} mode The mode of the modifier.
 * @property {string} priority The priority of the modifier.
 */

/**
 * The base data model for a bonus.
 */
export class Babonus extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      id: new DocumentIdField({required: true}),
      name: new StringField({required: true, blank: false}),
      img: new FilePathField({required: true, categories: ["IMAGE"], initial: "icons/svg/upgrade.svg"}),
      type: new StringField({required: true, choices: [
        "attackRoll", "damageRoll", "savingThrowDc", "savingThrow", "abilityCheck", "hitDie"
      ]}),
      description: new HTMLField(),
      bonus: new StringField({required: true, blank: false, initial: "1"}),
      enabled: new BooleanField({initial: true}),
      optional: new BooleanField(),
      consumption: new EmbeddedDataField(ConsumptionModel),
      aura: new EmbeddedDataField(AuraModel),
      modifiers: new EmbeddedDataField(ModifiersModel),
      filters: new ObjectField(),
      sort: new IntegerSortField()
    };
  }

  /**
   * Get the parent document that owns this bonus.
   * @returns {Document} The parent document.
   */
  get parent() {
    return this._parent;
  }

  /**
   * Get the UUID of the parent document.
   * @returns {string} The UUID of the parent document.
   */
  get parentUuid() {
    return this.parent.uuid;
  }

  /**
   * Get the actor that owns this bonus.
   * @returns {Actor|null} The actor, or null if not owned by an actor.
   */
  get actor() {
    return this.parent.documentName === "Actor" ? this.parent : this.parent.actor;
  }

  /**
   * Get the UUID of the actor that owns this bonus.
   * @returns {string|null} The UUID of the actor, or null if not owned by an actor.
   */
  get actorUuid() {
    return this.actor?.uuid ?? null;
  }

  /**
   * Get the item that owns this bonus.
   * @returns {Item|null} The item, or null if not owned by an item.
   */
  get item() {
    return this.parent.documentName === "Item" ? this.parent : null;
  }

  /**
   * Get the UUID of the item that owns this bonus.
   * @returns {string|null} The UUID of the item, or null if not owned by an item.
   */
  get itemUuid() {
    return this.item?.uuid ?? null;
  }

  /**
   * Get the effect that owns this bonus.
   * @returns {ActiveEffect|null} The effect, or null if not owned by an effect.
   */
  get effect() {
    return this.parent.documentName === "ActiveEffect" ? this.parent : null;
  }

  /**
   * Get the UUID of the effect that owns this bonus.
   * @returns {string|null} The UUID of the effect, or null if not owned by an effect.
   */
  get effectUuid() {
    return this.effect?.uuid ?? null;
  }

  /**
   * Get the region that owns this bonus.
   * @returns {RegionConfig|null} The region, or null if not owned by a region.
   */
  get region() {
    return this.parent.documentName === "RegionConfig" ? this.parent : null;
  }

  /**
   * Get the UUID of the region that owns this bonus.
   * @returns {string|null} The UUID of the region, or null if not owned by a region.
   */
  get regionUuid() {
    return this.region?.uuid ?? null;
  }

  /**
   * Get the roll data for this bonus.
   * @returns {object} The roll data.
   */
  getRollData() {
    const rollData = {};
    if (this.actor) foundry.utils.mergeObject(rollData, this.actor.getRollData());
    if (this.item) rollData.item = this.item.toObject();
    return rollData;
  }

  /**
   * Evaluate the bonus formula.
   * @param {object} [data={}] Additional data to include in the roll data.
   * @returns {number} The evaluated bonus.
   */
  async evaluateBonus(data = {}) {
    const rollData = foundry.utils.mergeObject(this.getRollData(), data);
    const roll = await new Roll(this.bonus, rollData).evaluate({async: true});
    return roll.total;
  }

  /**
   * Check if this bonus applies to a given context.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the bonus applies.
   */
  async applies(context) {
    // Check if the bonus is enabled
    if (!this.enabled) return false;

    // Check filters
    for (const [id, filter] of Object.entries(this.filters)) {
      const field = fields[id];
      if (!field) continue;
      if (!await field.applies(this, filter, context)) return false;
    }

    return true;
  }
}

/**
 * Data models for different types of bonuses.
 */
export default {
  attackRoll: class AttackRollBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        // Add attack roll specific fields here
      });
    }
  },
  damageRoll: class DamageRollBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        damageType: new StringField({choices: [
          "acid", "bludgeoning", "cold", "fire", "force", 
          "lightning", "necrotic", "piercing", "poison", 
          "psychic", "radiant", "slashing", "thunder",
          "healing"
        ]}),
        critical: new BooleanField()
      });
    }
  },
  savingThrowDc: class SavingThrowDcBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        // Add saving throw DC specific fields here
      });
    }
  },
  savingThrow: class SavingThrowBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        ability: new SetField(new StringField({choices: ["str", "dex", "con", "int", "wis", "cha"]}))
      });
    }
  },
  abilityCheck: class AbilityCheckBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        ability: new SetField(new StringField({choices: ["str", "dex", "con", "int", "wis", "cha"]})),
        skill: new SetField(new StringField({choices: [
          "acr", "ani", "arc", "ath", "dec", "his", 
          "ins", "itm", "inv", "med", "nat", "prc", 
          "prf", "per", "rel", "slt", "ste", "sur"
        ]}))
      });
    }
  },
  hitDie: class HitDieBonus extends Babonus {
    static defineSchema() {
      return foundry.utils.mergeObject(super.defineSchema(), {
        // Add hit die specific fields here
      });
    }
  }
};