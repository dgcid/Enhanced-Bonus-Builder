import api from "./api.mjs";

/**
 * Registry for tracking rolls and collecting applicable bonuses.
 */
class Registry {
  constructor() {
    this.registry = new Map();
  }

  /**
   * Register a roll for bonus collection.
   * @param {object} data The roll data.
   * @returns {string} The registry ID.
   */
  register(data) {
    const id = foundry.utils.randomID();
    this.registry.set(id, data);
    
    // Clean up old entries after 5 minutes
    setTimeout(() => this.registry.delete(id), 300000);
    
    return id;
  }

  /**
   * Get a registered roll.
   * @param {string} id The registry ID.
   * @returns {object|undefined} The roll data.
   */
  get(id) {
    return this.registry.get(id);
  }

  /**
   * Collect bonuses for a roll.
   * @param {string} type The type of roll.
   * @param {object} context The roll context.
   * @returns {Promise<Array>} The applicable bonuses.
   */
  async collect(type, context) {
    const { actor } = context;
    if (!actor) return [];
    
    const bonuses = [];
    
    // Get all documents with bonuses
    const documents = api.findEmbeddedDocumentsWithBonuses(actor);
    
    // Check each document for applicable bonuses
    for (const document of documents) {
      const documentBonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
      
      for (const [id, data] of Object.entries(documentBonuses)) {
        // Skip bonuses of the wrong type
        if (data.type !== type) continue;
        
        // Skip disabled bonuses
        if (!data.enabled) continue;
        
        // Create the bonus model
        const Model = enhancedBonusBuilder.abstract.DataModels[data.type];
        if (!Model) continue;
        
        const bonus = new Model(data, { parent: document });
        
        // Check if the bonus applies
        if (await bonus.applies(context)) {
          bonuses.push(bonus);
        }
      }
    }
    
    // Check for aura bonuses from other actors
    await this._collectAuraBonuses(bonuses, type, context);
    
    return bonuses;
  }

  /**
   * Collect aura bonuses from other actors.
   * @param {Array} bonuses The array to add bonuses to.
   * @param {string} type The type of roll.
   * @param {object} context The roll context.
   * @returns {Promise<void>}
   * @private
   */
  async _collectAuraBonuses(bonuses, type, context) {
    const { actor } = context;
    if (!actor || !actor.token) return;
    
    const sourceToken = actor.token;
    if (!sourceToken) return;
    
    // Get all tokens on the canvas
    const tokens = canvas.tokens.placeables;
    
    // Check each token for aura bonuses
    for (const token of tokens) {
      if (!token.actor) continue;
      
      // Skip the source token
      if (token.id === sourceToken.id) continue;
      
      // Get all documents with bonuses
      const documents = api.findEmbeddedDocumentsWithBonuses(token.actor);
      
      // Check each document for applicable aura bonuses
      for (const document of documents) {
        const documentBonuses = document.getFlag("enhanced-bonus-builder", "bonuses") ?? {};
        
        for (const [id, data] of Object.entries(documentBonuses)) {
          // Skip bonuses of the wrong type
          if (data.type !== type) continue;
          
          // Skip disabled bonuses
          if (!data.enabled) continue;
          
          // Skip non-aura bonuses
          if (!data.aura?.enabled) continue;
          
          // Create the bonus model
          const Model = enhancedBonusBuilder.abstract.DataModels[data.type];
          if (!Model) continue;
          
          const bonus = new Model(data, { parent: document });
          
          // Check if the aura applies
          if (bonus.aura.applies(token, sourceToken)) {
            // Check if the bonus applies
            if (await bonus.applies(context)) {
              bonuses.push(bonus);
            }
          }
        }
      }
    }
  }
}

export default new Registry();