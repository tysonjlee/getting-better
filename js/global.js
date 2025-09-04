/** @note Make sure each js file imports from this global file! */

// Imports 
import {
  injectNavBarTemplate
} from "./navbar.js"; 
import {
  injectNoteModalTemplate,
  injectCreateModalTemplate, 
  setupModalListeners,
  openNoteModal
} from "./modal.js"; 

// Constants & Variables 
window.App = window.App || {};

const notesById = JSON.parse(localStorage.getItem("notesById")) || {}; // Single truth source 
window.App.notesById = notesById; 
/**
 * notesById = {
 *  "uniqueId1": {
 *    "content": string
 *    "createdAt": int (epoch)
 *    "wasUpdated": boolean
 *    "updatedAt": int (epoch) || null if not updated 
 *    "lastChangeAt": int (epoch) [greatest of createdAt & updatedAt times]
 *    "isDeleted": boolean
 *    "deletedAt": int (epoch) || null if not deleted
 *    "pinned": boolean
 *   }
 *   ...
 * }
 */

const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of note ID's descending by timestamp created/edited
window.App.notesByOrder = notesByOrder; 

const notesPinnedByOrder = JSON.parse(localStorage.getItem("notesPinnedByOrder")) || []; // Array of pinned note ID's descending by timestamp pinned
window.App.notesPinnedByOrder = notesPinnedByOrder; 

const notesDeletedByOrder = JSON.parse(localStorage.getItem("notesDeletedByOrder")) || []; // Array of deleted note ID's descending by timestamp deleted
window.App.notesDeletedByOrder = notesDeletedByOrder; 

// Event Listeners 

// Functions 
async function render(page) {
  /**
   * @brief Renders the specified page 
   * @param page The specific page to render
   * @return nothing (void)
   */
  
  if (page === "home"){
    const homeModule = await import("./index.js");
    homeModule.renderHome(); 
  } else if (page === "manager"){
    const managerModule = await import("./manager.js"); 
    managerModule.renderManager(); 
  } else if (page === "deleted") {
    const deletedModule = await import("./deleted.js"); 
    deletedModule.renderDeleted(); 
  }
}
window.App.render = render; 

// Event Listeners
window.addEventListener("load", async () => {
  setupPage(); 
});

// Functions
async function setupPage() {
  /**
   * @brief Calls all necessary functions that should be ran on every page 
   * @return nothing (void)
   */

  // Inject templates
  await injectNavBarTemplate(); 
  await injectCreateModalTemplate(); 
  await injectNoteModalTemplate(); 

  // Modal logic
  setupModalListeners(); 

  // Render the page
  render(window.currentPage);   
}

async function createNoteCardElement(id) {
  /**
   * @brief Creates a note card div element for an already existing note (id)
   * @param id: The id of the note to target 
   * @return The final note card 
   */

  // Get note card from template
  const noteCardTemplate = await getNoteCardTemplate(); 
  const clone = noteCardTemplate.content.cloneNode(true);
  const noteCard = clone.firstElementChild; 

  // Set id
  noteCard.id = `note-${id}`; 

  // Add event listener for note modal 
  noteCard.addEventListener("click", () => {
    openNoteModal(id); 
  }); 

  // Add pin icon (if applicable)
  if (notesById[id].pinned) noteCard.querySelector("#pin-status").classList.remove("hidden"); 
  else noteCard.querySelector("#pin-status").classList.add("hidden");

  // Add content  
  noteCard.querySelector("#note-content").textContent = notesById[id].content

  // Return the final note card
  return noteCard; 
}

window.App.createNoteCardElement = createNoteCardElement; 

async function getNoteCardTemplate() {
  /**
   * @brief Returns the raw HTML from note-card.tpl wrapped in a <template>
   * @return: The final, wrapped template
   */

  // Wrap raw HTML in a <template>
  const response = await fetch("../components/note-card.tpl"); 
  const text = await response.text(); 
  const template = document.createElement("template"); 
  template.innerHTML = text; 

  return template; 
}

function createSVG(type) {
  /** 
   * @brief Dynamically creates an SVG element of the specified type
   * @note Doing this to allow for coloring of the editSVG via Tailwind
   * @param type The type of SVG (see below)
   * @return The final SVG element
   */

  if (type === "confirm") return createConfirmSVG(); 
  else if (type === "delete") return createDeleteSVG();
  else if (type === "recover") return createRecoverSVG(); 
  else if (type === "pin-button") return createPinButtonSVG(); 
  else if (type === "pin-status") return createPinStatusSVG(); 
}
window.App.createSVG = createSVG; 

function createConfirmSVG() {
  /**
   * @briefs: Creates the correct SVG element for the confirm (edit) button
   * @note Helper for createSVG()
   * @return The final SVG element 
   */

  // Create & set the confirm button 
  const confirmSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  confirmSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  confirmSVG.setAttribute("viewBox", "0 0 32 32");
  confirmSVG.setAttribute("fill", "currentColor");
  confirmSVG.setAttribute("class", "w-10 h-10 text-midnight-text");

  // Create the SVG's path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z");
  confirmSVG.appendChild(path);

  // Return the final SVG
  return confirmSVG;
}

function createDeleteSVG() {
  /**
   * @briefs: Creates the correct SVG element for the delete button
   * @note Helper for createSVG()
   * @return The final SVG element 
   */

  // Create & set the delete button 
  const deleteSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  deleteSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  deleteSVG.setAttribute("viewBox", "0 0 32 32");
  deleteSVG.setAttribute("fill", "currentColor");
  deleteSVG.setAttribute("class", "w-10 h-10 text-midnight-text");

  // Create the SVG's path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 14 4 C 13.476563 4 12.941406 4.183594 12.5625 4.5625 C 12.183594 4.941406 12 5.476563 12 6 L 12 7 L 5 7 L 5 9 L 6.09375 9 L 8 27.09375 L 8.09375 28 L 23.90625 28 L 24 27.09375 L 25.90625 9 L 27 9 L 27 7 L 20 7 L 20 6 C 20 5.476563 19.816406 4.941406 19.4375 4.5625 C 19.058594 4.183594 18.523438 4 18 4 Z M 14 6 L 18 6 L 18 7 L 14 7 Z M 8.125 9 L 23.875 9 L 22.09375 26 L 9.90625 26 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 15 12 L 15 23 L 17 23 L 17 12 Z M 18 12 L 18 23 L 20 23 L 20 12 Z");
  deleteSVG.appendChild(path);

  // Return the final SVG
  return deleteSVG;
}

function createRecoverSVG() {
  /**
   * @briefs: Creates the correct SVG element for the recover button
   * @note Helper for createSVG()
   * @return The final SVG element 
   */

  // Create & set the recover button 
  const recoverSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  recoverSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  recoverSVG.setAttribute("viewBox", "0 0 32 32");
  recoverSVG.setAttribute("fill", "currentColor");
  recoverSVG.setAttribute("class", "w-10 h-10 text-midnight-text");

  // Create the SVG's path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 L 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 C 19.875 5 23.261719 6.984375 25.21875 10 L 20 10 L 20 12 L 28 12 L 28 4 L 26 4 L 26 7.71875 C 23.617188 4.84375 20.019531 3 16 3 Z");
  recoverSVG.appendChild(path);

  // Return the final SVG
  return recoverSVG;
}

function createPinButtonSVG() {
  /**
   * @briefs: Creates the correct SVG element for the pin button
   * @note Helper for createSVG()
   * @return The final SVG element 
   */

  // Create & set the pin button 
  const pinSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  pinSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  pinSVG.setAttribute("viewBox", "0 0 32 32");
  pinSVG.setAttribute("fill", "currentColor");
  pinSVG.setAttribute("class", "w-10 h-10 text-midnight-text");

  // Create the SVG's path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 20.53125 2.5625 L 19.84375 3.5 L 14.9375 10.1875 C 12.308594 9.730469 9.527344 10.472656 7.5 12.5 L 6.78125 13.1875 L 12.09375 18.5 L 4 26.59375 L 4 28 L 5.40625 28 L 13.5 19.90625 L 18.8125 25.21875 L 19.5 24.5 C 21.527344 22.472656 22.269531 19.691406 21.8125 17.0625 L 28.5 12.15625 L 29.4375 11.46875 Z M 20.78125 5.625 L 26.375 11.21875 L 20.15625 15.78125 L 19.59375 16.1875 L 19.78125 16.84375 C 20.261719 18.675781 19.738281 20.585938 18.59375 22.1875 L 9.8125 13.40625 C 11.414063 12.261719 13.324219 11.738281 15.15625 12.21875 L 15.8125 12.40625 L 16.21875 11.84375 Z");
  pinSVG.appendChild(path);

  // Return the final SVG
  return pinSVG;
}

function createPinStatusSVG() {
  /**
   * @briefs: Creates the correct SVG element for the pin status
   * @note Helper for createSVG()
   * @return The final SVG element 
   */

  // Create & set the pin status icon
  const pinSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  pinSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  pinSVG.setAttribute("viewBox", "0 0 32 32");
  pinSVG.setAttribute("fill", "currentColor");
  pinSVG.setAttribute("class", "pr-1 pt-1 w-6 h-6 text-red-600");

  // Create the SVG's path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 20.53125 2.5625 L 19.84375 3.5 L 14.9375 10.1875 C 12.308594 9.730469 9.527344 10.472656 7.5 12.5 L 6.78125 13.1875 L 12.09375 18.5 L 4 26.59375 L 4 28 L 5.40625 28 L 13.5 19.90625 L 18.8125 25.21875 L 19.5 24.5 C 21.527344 22.472656 22.269531 19.691406 21.8125 17.0625 L 28.5 12.15625 L 29.4375 11.46875 Z M 20.78125 5.625 L 26.375 11.21875 L 20.15625 15.78125 L 19.59375 16.1875 L 19.78125 16.84375 C 20.261719 18.675781 19.738281 20.585938 18.59375 22.1875 L 9.8125 13.40625 C 11.414063 12.261719 13.324219 11.738281 15.15625 12.21875 L 15.8125 12.40625 L 16.21875 11.84375 Z");
  pinSVG.appendChild(path);

  // Return the final SVG
  return pinSVG;
}

function convertTimestamp(epochMS) {
  /**
   * @brief Converts time since epoch in MS to a formatted date string to be shown on a note card 
   * @note formatted as month/day/full_year, x:xx:xx AM/PM
   * @param epochMS time since epoch in MS 
   * @return the formatted string 
   */

  const epochDate = new Date(epochMS); 
  return epochDate.toLocaleString("en-US"); 
}
window.App.convertTimestamp = convertTimestamp; 
