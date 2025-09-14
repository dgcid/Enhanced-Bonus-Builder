/**
 * Model for consumption properties of a bonus.
 */

const { BooleanField, NumberField, SchemaField, StringField } = foundry.data.fields;

/**
 * Configuration for how a bonus consumes a property.
 */
export default class ConsumptionModel extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    return {
      enabled: new BooleanField({initial: false}),
      scales: new BooleanField({initial: false}),
      type: new StringField({
        choices: [
          "attributes", "currency", "resources", "uses", "charges", "slots", "hitDice"
        ]
      }),
      value: new SchemaField({
        min: new StringField({initial: "1"}),
        max: new StringField({initial: "1"}),
        step: new NumberField({initial: 1, integer: true, min: 1})
      }),
      formula: new StringField({initial: "@consumption"})
    };
  }

  /**
   * Get the available consumption types for a given document.
   * @param {Document} document The document to check.
   * @returns {object} The available consumption types.
   */
  static getAvailableTypes(document) {
    const types = {};
    
    // Actor-specific consumption types
    if (document.documentName === "Actor") {
      types.attributes = "ENHANCEDBONUSBUILDER.ConsumptionTypes.attributes";
      types.currency = "ENHANCEDBONUSBUILDER.ConsumptionTypes.currency";
      types.resources = "ENHANCEDBONUSBUILDER.ConsumptionTypes.resources";
      types.hitDice = "ENHANCEDBONUSBUILDER.ConsumptionTypes.hitDice";
    }
    
    // Item-specific consumption types
    if (document.documentName === "Item") {
      if (document.system.uses?.max) {
        types.uses = "ENHANCEDBONUSBUILDER.ConsumptionTypes.uses";
      }
      if (document.system.consume?.type === "charges") {
        types.charges = "ENHANCEDBONUSBUILDER.ConsumptionTypes.charges";
      }
      if (document.type === "spell") {
        types.slots = "ENHANCEDBONUSBUILDER.ConsumptionTypes.slots";
      }
    }
    
    return types;
  }

  /**
   * Get the available properties for a given consumption type and document.
   * @param {string} type The consumption type.
   * @param {Document} document The document to check.
   * @returns {object} The available properties.
   */
  static getAvailableProperties(type, document) {
    const properties = {};
    
    switch (type) {
      case "attributes":
        if (document.documentName === "Actor") {
          for (const [key, attr] of Object.entries(document.system.attributes)) {
            if (typeof attr === "object" && attr !== null && "value" in attr) {
              properties[key] = key;
            }
          }
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          for (const [key, value] of Object.entries(document.system.currency)) {
            if (typeof value === "number") {
              properties[key] = key;
            }
          }
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          for (const [key, res] of Object.entries(document.system.resources)) {
            if (typeof res === "object" && res !== null && "value" in res) {
              properties[key] = key;
            }
          }
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          for (const [key, cls] of Object.entries(document.classes)) {
            properties[key] = cls.name;
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          properties.uses = "uses";
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          properties.charges = "charges";
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          for (let i = 1; i <= 9; i++) {
            properties[i] = `Level ${i}`;
          }
        }
        break;
    }
    
    return properties;
  }

  /**
   * Consume the property.
   * @param {Document} document The document to consume from.
   * @param {string} property The property to consume.
   * @param {number} amount The amount to consume.
   * @returns {Promise<Document>} The updated document.
   */
  async consume(document, property, amount) {
    const updates = {};
    
    switch (this.type) {
      case "attributes":
        if (document.documentName === "Actor") {
          updates[`system.attributes.${property}.value`] = Math.max(0, document.system.attributes[property].value - amount);
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          updates[`system.currency.${property}`] = Math.max(0, document.system.currency[property] - amount);
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          updates[`system.resources.${property}.value`] = Math.max(0, document.system.resources[property].value - amount);
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          const cls = document.classes[property];
          if (cls) {
            updates[`system.classes.${property}.hitDiceUsed`] = Math.min(
              cls.system.levels,
              cls.system.hitDiceUsed + amount
            );
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          updates["system.uses.value"] = Math.max(0, document.system.uses.value - amount);
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          const target = document.system.consume.target;
          const item = document.actor.items.get(target);
          if (item) {
            await item.update({
              "system.uses.value": Math.max(0, item.system.uses.value - amount)
            });
          }
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          const level = parseInt(property);
          if (!isNaN(level) && document.actor) {
            const spells = document.actor.system.spells;
            if (spells[`spell${level}`]) {
              updates[`system.spells.spell${level}.value`] = Math.max(
                0,
                spells[`spell${level}`].value - amount
              );
            }
          }
        }
        break;
    }
    
    if (Object.keys(updates).length > 0) {
      return document.update(updates);
    }
    
    return document;
  }

  /**
   * Get the current value of the property.
   * @param {Document} document The document to check.
   * @param {string} property The property to check.
   * @returns {number} The current value.
   */
  getCurrentValue(document, property) {
    switch (this.type) {
      case "attributes":
        if (document.documentName === "Actor") {
          return document.system.attributes[property]?.value ?? 0;
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          return document.system.currency[property] ?? 0;
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          return document.system.resources[property]?.value ?? 0;
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          const cls = document.classes[property];
          if (cls) {
            return cls.system.levels - cls.system.hitDiceUsed;
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          return document.system.uses.value;
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          const target = document.system.consume.target;
          const item = document.actor.items.get(target);
          if (item) {
            return item.system.uses.value;
          }
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          const level = parseInt(property);
          if (!isNaN(level) && document.actor) {
            const spells = document.actor.system.spells;
            if (spells[`spell${level}`]) {
              return spells[`spell${level}`].value;
            }
          }
        }
        break;
    }
    
    return 0;
  }

  /**
   * Get the maximum value of the property.
   * @param {Document} document The document to check.
   * @param {string} property The property to check.
   * @returns {number} The maximum value.
   */
  getMaxValue(document, property) {
    switch (this.type) {
      case "attributes":
        if (document.documentName === "Actor") {
          return document.system.attributes[property]?.max ?? 0;
        }
        break;
      case "currency":
        if (document.documentName === "Actor") {
          return Infinity;
        }
        break;
      case "resources":
        if (document.documentName === "Actor") {
          return document.system.resources[property]?.max ?? 0;
        }
        break;
      case "hitDice":
        if (document.documentName === "Actor") {
          const cls = document.classes[property];
          if (cls) {
            return cls.system.levels;
          }
        }
        break;
      case "uses":
        if (document.documentName === "Item" && document.system.uses?.max) {
          return document.system.uses.max;
        }
        break;
      case "charges":
        if (document.documentName === "Item" && document.system.consume?.type === "charges") {
          const target = document.system.consume.target;
          const item = document.actor.items.get(target);
          if (item) {
            return item.system.uses.max;
          }
        }
        break;
      case "slots":
        if (document.documentName === "Item" && document.type === "spell") {
          const level = parseInt(property);
          if (!isNaN(level) && document.actor) {
            const spells = document.actor.system.spells;
            if (spells[`spell${level}`]) {
              return spells[`spell${level}`].max;
            }
          }
        }
        break;
    }
    
    return 0;
  }
}