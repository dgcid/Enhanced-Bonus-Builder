import { MODULE } from "../constants.mjs";
import api from "../api.mjs";

/**
 * Set up text enrichers.
 */
export default function enricherSetup() {
  // Add the bonus enricher
  CONFIG.TextEditor.enrichers.push({
    pattern: /@bonus\[([^\]]+)\](?:{([^}]+)})?/gi,
    enricher: enrichBonus
  });
}

/**
 * Enrich a bonus reference.
 * @param {object} match The regex match.
 * @param {object} options The enrichment options.
 * @returns {Promise<HTMLElement>} The enriched HTML.
 */
async function enrichBonus(match, options) {
  const [, reference, label] = match;
  
  // Parse the reference
  const [documentUuid, bonusId] = reference.split(".");
  if (!documentUuid || !bonusId) return null;
  
  // Get the bonus
  const bonus = await api.fromUuid(documentUuid, bonusId);
  if (!bonus) return null;
  
  // Create the element
  const element = document.createElement("a");
  element.classList.add("enhanced-bonus-builder-link");
  element.dataset.uuid = documentUuid;
  element.dataset.bonusId = bonusId;
  element.title = bonus.name;
  
  // Set the content
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-calculator", "enhanced-bonus-builder-icon");
  if (bonus.iconColor) {
    icon.style.color = bonus.iconColor;
  }
  
  element.appendChild(icon);
  element.appendChild(document.createTextNode(label || bonus.name));
  
  // Add event listener
  element.addEventListener("click", async (event) => {
    event.preventDefault();
    
    // Toggle the bonus
    await api.hotbarToggle(documentUuid, bonusId);
  });
  
  return element;
}