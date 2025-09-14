/**
 * A collection of bonuses for a document.
 */
export default class BonusCollection {
  /**
   * @param {Document} document The document to collect bonuses for.
   */
  constructor(document) {
    this.document = document;
    this.bonuses = [];
    this._initialize();
  }

  /**
   * Initialize the collection.
   * @private
   */
  _initialize() {
    const bonuses = this.document.getFlag("enhanced-bonus-builder", "bonuses") || {};
    
    for (const [id, data] of Object.entries(bonuses)) {
      const Model = enhancedBonusBuilder.abstract.DataModels[data.type];
      if (!Model) continue;
      
      const bonus = new Model(data, {parent: this.document});
      this.bonuses.push(bonus);
    }
    
    // Sort bonuses by sort order
    this.bonuses.sort((a, b) => a.sort - b.sort);
  }

  /**
   * Get all bonuses in the collection.
   * @returns {Array<Babonus>} The bonuses.
   */
  getAll() {
    return [...this.bonuses];
  }

  /**
   * Get bonuses of a specific type.
   * @param {string} type The type of bonuses to get.
   * @returns {Array<Babonus>} The bonuses of the specified type.
   */
  getByType(type) {
    return this.bonuses.filter(b => b.type === type);
  }

  /**
   * Get enabled bonuses.
   * @returns {Array<Babonus>} The enabled bonuses.
   */
  getEnabled() {
    return this.bonuses.filter(b => b.enabled);
  }

  /**
   * Get optional bonuses.
   * @returns {Array<Babonus>} The optional bonuses.
   */
  getOptional() {
    return this.bonuses.filter(b => b.optional);
  }

  /**
   * Get bonuses that apply to a specific context.
   * @param {object} context The context to check against.
   * @returns {Promise<Array<Babonus>>} The applicable bonuses.
   */
  async getApplicable(context) {
    const applicable = [];
    
    for (const bonus of this.bonuses) {
      if (await bonus.applies(context)) {
        applicable.push(bonus);
      }
    }
    
    return applicable;
  }

  /**
   * Add a bonus to the collection.
   * @param {Babonus} bonus The bonus to add.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async add(bonus) {
    // Add the bonus to the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag("enhanced-bonus-builder", "bonuses") || {});
    bonuses[bonus.id] = bonus.toObject();
    await this.document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
    
    // Add the bonus to the collection
    this.bonuses.push(bonus);
    
    return this;
  }

  /**
   * Remove a bonus from the collection.
   * @param {string} id The ID of the bonus to remove.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async remove(id) {
    // Remove the bonus from the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag("enhanced-bonus-builder", "bonuses") || {});
    delete bonuses[id];
    await this.document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
    
    // Remove the bonus from the collection
    this.bonuses = this.bonuses.filter(b => b.id !== id);
    
    return this;
  }

  /**
   * Update a bonus in the collection.
   * @param {Babonus} bonus The bonus to update.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async update(bonus) {
    // Update the bonus in the document
    const bonuses = foundry.utils.deepClone(this.document.getFlag("enhanced-bonus-builder", "bonuses") || {});
    bonuses[bonus.id] = bonus.toObject();
    await this.document.setFlag("enhanced-bonus-builder", "bonuses", bonuses);
    
    // Update the bonus in the collection
    const index = this.bonuses.findIndex(b => b.id === bonus.id);
    if (index !== -1) {
      this.bonuses[index] = bonus;
    }
    
    return this;
  }

  /**
   * Clear all bonuses from the collection.
   * @returns {Promise<BonusCollection>} This collection.
   */
  async clear() {
    // Clear the bonuses from the document
    await this.document.unsetFlag("enhanced-bonus-builder", "bonuses");
    
    // Clear the bonuses from the collection
    this.bonuses = [];
    
    return this;
  }
}