/**
 * Filter system for bonuses.
 */

/**
 * Filter definitions.
 */
export const filters = {
  /**
   * Filter by item type.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  itemType: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item) return false;
    
    return filter.includes(item.type);
  },
  
  /**
   * Filter by weapon type.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  weaponType: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "weapon") return false;
    
    return filter.includes(item.system.weaponType);
  },
  
  /**
   * Filter by weapon properties.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  weaponProperties: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "weapon") return false;
    
    const properties = item.system.properties || {};
    
    for (const property of filter) {
      if (!properties[property]) return false;
    }
    
    return true;
  },
  
  /**
   * Filter by armor type.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  armorType: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "equipment" || !item.system.armor) return false;
    
    return filter.includes(item.system.armor.type);
  },
  
  /**
   * Filter by spell level.
   * @param {Babonus} bonus The bonus to check.
   * @param {object} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  spellLevel: (bonus, filter, context) => {
    if (!filter) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const level = item.system.level;
    
    if (filter.min !== undefined && level < filter.min) return false;
    if (filter.max !== undefined && level > filter.max) return false;
    
    return true;
  },
  
  /**
   * Filter by spell school.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  spellSchool: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    return filter.includes(item.system.school);
  },
  
  /**
   * Filter by spell components.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  spellComponents: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const components = item.system.components || {};
    
    for (const component of filter) {
      if (component === "v" && !components.vocal) return false;
      if (component === "s" && !components.somatic) return false;
      if (component === "m" && !components.material) return false;
    }
    
    return true;
  },
  
  /**
   * Filter by damage types.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  damageTypes: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const item = context.item;
    if (!item) return false;
    
    // Check for damage types in the item
    if (item.system.damage?.parts) {
      for (const [, damageType] of item.system.damage.parts) {
        if (filter.includes(damageType)) return true;
      }
    }
    
    // Check for damage types in the bonus itself
    if (bonus.damageType && filter.includes(bonus.damageType)) return true;
    
    return false;
  },
  
  /**
   * Filter by abilities.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  abilities: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const ability = context.ability;
    if (!ability) return false;
    
    return filter.includes(ability);
  },
  
  /**
   * Filter by skills.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  skills: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const skill = context.skill;
    if (!skill) return false;
    
    return filter.includes(skill);
  },
  
  /**
   * Filter by proficiency.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  proficiency: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const { actor, item } = context;
    if (!actor || !item) return false;
    
    let hasProficiency = false;
    
    if (item.type === "weapon") {
      hasProficiency = enhancedBonusBuilder.api.hasWeaponProficiency(actor, item);
    } else if (item.type === "equipment" && item.system.armor) {
      hasProficiency = enhancedBonusBuilder.api.hasArmorProficiency(actor, item);
    } else if (item.type === "tool") {
      hasProficiency = enhancedBonusBuilder.api.hasToolProficiency(actor, item);
    }
    
    return filter === hasProficiency;
  },
  
  /**
   * Filter by markers.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  markers: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const { actor, target } = context;
    if (!actor) return false;
    
    // Check actor markers
    const actorMarkers = actor.getFlag("enhanced-bonus-builder", "markers") || [];
    const hasAllActorMarkers = filter.every(m => actorMarkers.includes(m));
    if (hasAllActorMarkers) return true;
    
    // Check target markers if available
    if (target) {
      const targetMarkers = target.getFlag("enhanced-bonus-builder", "markers") || [];
      const hasAllTargetMarkers = filter.every(m => targetMarkers.includes(m));
      if (hasAllTargetMarkers) return true;
    }
    
    return false;
  },
  
  /**
   * Filter by conditions.
   * @param {Babonus} bonus The bonus to check.
   * @param {Array<string>} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  conditions: (bonus, filter, context) => {
    if (!filter || !filter.length) return true;
    
    const { actor, target } = context;
    if (!actor) return false;
    
    // Check actor conditions
    for (const condition of filter) {
      if (actor.effects.some(e => e.statuses.has(condition))) return true;
    }
    
    // Check target conditions if available
    if (target) {
      for (const condition of filter) {
        if (target.effects.some(e => e.statuses.has(condition))) return true;
      }
    }
    
    return false;
  },
  
  /**
   * Filter by distance.
   * @param {Babonus} bonus The bonus to check.
   * @param {object} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  distance: (bonus, filter, context) => {
    if (!filter) return true;
    
    const { actor, target } = context;
    if (!actor || !target || !actor.token || !target.token) return false;
    
    const distance = canvas.grid.measureDistance(actor.token, target.token);
    
    if (filter.min !== undefined && distance < filter.min) return false;
    if (filter.max !== undefined && distance > filter.max) return false;
    
    return true;
  },
  
  /**
   * Filter by equipped status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  equipped: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item) return false;
    
    const isEquipped = item.system.equipped === true;
    return filter === isEquipped;
  },
  
  /**
   * Filter by attunement status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  attunement: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item) return false;
    
    const isAttuned = item.system.attunement === 2; // 2 = attuned
    return filter === isAttuned;
  },
  
  /**
   * Filter by prepared status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  prepared: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const isPrepared = item.system.preparation?.prepared === true;
    return filter === isPrepared;
  },
  
  /**
   * Filter by concentration status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  concentration: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const isConcentration = item.system.components?.concentration === true;
    return filter === isConcentration;
  },
  
  /**
   * Filter by ritual status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  ritual: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const item = context.item;
    if (!item || item.type !== "spell") return false;
    
    const isRitual = item.system.components?.ritual === true;
    return filter === isRitual;
  },
  
  /**
   * Filter by critical hit status.
   * @param {Babonus} bonus The bonus to check.
   * @param {boolean} filter The filter value.
   * @param {object} context The context to check against.
   * @returns {boolean} Whether the filter passes.
   */
  critical: (bonus, filter, context) => {
    if (filter === undefined) return true;
    
    const isCritical = context.critical === true;
    return filter === isCritical;
  }
};