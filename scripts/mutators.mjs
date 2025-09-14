import registry from "./registry.mjs";
import { MODULE, SETTINGS } from "./constants.mjs";

/**
 * Handle the preRollAttack hook.
 * @param {Actor} actor The actor rolling the attack.
 * @param {Item} item The item being used.
 * @param {object} config The roll configuration.
 */
async function preRollAttack(actor, item, config) {
  if (!actor || !item) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "attackRoll",
    actor,
    item,
    config
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "attackRoll",
    options: {
      actor,
      item
    }
  };
}

/**
 * Handle the rollAttack hook.
 * @param {Actor} actor The actor rolling the attack.
 * @param {Item} item The item being used.
 * @param {Roll} roll The attack roll.
 * @param {object} ammo The ammunition used, if any.
 */
async function rollAttack(actor, item, roll, ammo) {
  if (!actor || !item || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("attackRoll", {
    actor,
    item,
    roll,
    ammo
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating attack roll bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollDamage hook.
 * @param {Actor} actor The actor rolling damage.
 * @param {Item} item The item being used.
 * @param {object} config The roll configuration.
 */
async function preRollDamage(actor, item, config) {
  if (!actor || !item) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "damageRoll",
    actor,
    item,
    config
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "damageRoll",
    options: {
      actor,
      item,
      critical: config.critical
    }
  };
}

/**
 * Handle the rollDamage hook.
 * @param {Actor} actor The actor rolling damage.
 * @param {Item} item The item being used.
 * @param {Roll} roll The damage roll.
 * @param {object} ammo The ammunition used, if any.
 * @param {object} options The roll options.
 */
async function rollDamage(actor, item, roll, ammo, options) {
  if (!actor || !item || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("damageRoll", {
    actor,
    item,
    roll,
    ammo,
    critical: options?.critical
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value,
        damageType: bonus.damageType
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating damage roll bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => {
      const type = p.damageType ? ` (${game.i18n.localize(`DND5E.Damage${p.damageType.capitalize()}`)})` : "";
      return `<li>${p.name}${type}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`;
    }).join("");
    
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollAbilitySave hook.
 * @param {Actor} actor The actor rolling the save.
 * @param {object} config The roll configuration.
 * @param {string} ability The ability being used.
 */
async function preRollAbilitySave(actor, config, ability) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "savingThrow",
    actor,
    config,
    ability
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "savingThrow",
    options: {
      actor,
      ability
    }
  };
}

/**
 * Handle the rollAbilitySave hook.
 * @param {Actor} actor The actor rolling the save.
 * @param {Roll} roll The save roll.
 * @param {string} ability The ability being used.
 */
async function rollAbilitySave(actor, roll, ability) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("savingThrow", {
    actor,
    roll,
    ability
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating saving throw bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollAbilityTest hook.
 * @param {Actor} actor The actor rolling the test.
 * @param {object} config The roll configuration.
 * @param {string} ability The ability being used.
 */
async function preRollAbilityTest(actor, config, ability) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "abilityCheck",
    actor,
    config,
    ability
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "abilityCheck",
    options: {
      actor,
      ability
    }
  };
}

/**
 * Handle the rollAbilityTest hook.
 * @param {Actor} actor The actor rolling the test.
 * @param {Roll} roll The test roll.
 * @param {string} ability The ability being used.
 */
async function rollAbilityTest(actor, roll, ability) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("abilityCheck", {
    actor,
    roll,
    ability
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating ability check bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollDeathSave hook.
 * @param {Actor} actor The actor rolling the death save.
 * @param {object} config The roll configuration.
 */
async function preRollDeathSave(actor, config) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "savingThrow",
    actor,
    config,
    ability: "death"
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "savingThrow",
    options: {
      actor,
      ability: "death"
    }
  };
}

/**
 * Handle the rollDeathSave hook.
 * @param {Actor} actor The actor rolling the death save.
 * @param {Roll} roll The death save roll.
 */
async function rollDeathSave(actor, roll) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("savingThrow", {
    actor,
    roll,
    ability: "death"
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating death save bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

/**
 * Handle the preRollHitDie hook.
 * @param {Actor} actor The actor rolling the hit die.
 * @param {object} config The roll configuration.
 * @param {string} denomination The hit die denomination.
 */
async function preRollHitDie(actor, config, denomination) {
  if (!actor) return;
  
  // Register the roll for bonuses
  const uuid = registry.register({
    type: "hitDie",
    actor,
    config,
    denomination
  });
  
  // Store the registry ID in the config
  config.enhancedBonusBuilder = {
    registry: uuid,
    type: "hitDie",
    options: {
      actor,
      denomination
    }
  };
}

/**
 * Handle the rollHitDie hook.
 * @param {Actor} actor The actor rolling the hit die.
 * @param {Roll} roll The hit die roll.
 */
async function rollHitDie(actor, roll) {
  if (!actor || !roll) return;
  
  // Apply bonuses to the roll
  const showApplied = game.settings.get(MODULE.ID, SETTINGS.SHOW_APPLIED);
  const bonuses = await registry.collect("hitDie", {
    actor,
    roll
  });
  
  if (bonuses.length === 0) return;
  
  // Apply bonuses
  let totalBonus = 0;
  const parts = [];
  
  for (const bonus of bonuses) {
    try {
      const value = await bonus.evaluateBonus();
      if (value === 0) continue;
      
      totalBonus += value;
      parts.push({
        name: bonus.name,
        value
      });
    } catch (error) {
      console.error("Enhanced Bonus Builder | Error evaluating hit die bonus:", error);
    }
  }
  
  if (totalBonus === 0) return;
  
  // Apply the bonus to the roll
  const formula = roll.formula + ` + ${totalBonus}`;
  const newRoll = await new Roll(formula, roll.data).evaluate({async: true});
  
  // Replace the roll
  roll.terms = newRoll.terms;
  roll.formula = newRoll.formula;
  roll._total = newRoll.total;
  roll._evaluated = true;
  
  // Show applied bonuses
  if (showApplied && parts.length > 0) {
    const content = parts.map(p => `<li>${p.name}: ${p.value >= 0 ? '+' : ''}${p.value}</li>`).join("");
    ChatMessage.create({
      content: `
        <div class="enhanced-bonus-builder applied-bonuses">
          <h3>${game.i18n.localize("ENHANCEDBONUSBUILDER.AppliedBonuses")}</h3>
          <ul>${content}</ul>
          <p>${game.i18n.localize("ENHANCEDBONUSBUILDER.TotalBonus")}: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</p>
        </div>
      `,
      speaker: ChatMessage.getSpeaker({actor})
    });
  }
}

export default {
  preRollAttack,
  rollAttack,
  preRollDamage,
  rollDamage,
  preRollAbilitySave,
  rollAbilitySave,
  preRollAbilityTest,
  rollAbilityTest,
  preRollDeathSave,
  rollDeathSave,
  preRollHitDie,
  rollHitDie
};