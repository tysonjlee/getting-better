/** @note: Make sure each js file imports from this global file! */

// Constants & Variables 
export const notesById = JSON.parse(localStorage.getItem("notesById")) || {}; // Single truth source 
window.notesById = notesById; 
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
 *   }
 *   ...
 * }
 */

export const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of note ID's descending by timestamp created/edited
window.notesByOrder = notesByOrder; 
// notesByOrder = ["uniqueId20", "uniqueId19", "uniqueId18", ...]

export const notesDeletedByOrder = JSON.parse(localStorage.getItem("notesDeletedByOrder")) || []; // Array of deleted note ID's descending by timestamp deleted
window.notesDeletedByOrder = notesDeletedByOrder; 
// notesDeletedByOrder = ["uniqueId200", "uniqueId199", "uniqueId198", ...]

// Event Listeners 

// Functions 
export async function render(page) {
  /**
   * @brief: Renders the specified page 
   * @param page: The specific page to render
   * @return: nothing (void)
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
window.render = render; 

export function convertTimestamp(epochMS) {
  /**
   * @brief: Converts time since epoch in MS to a formatted date string to be shown on a note card 
   * @note: formatted as month/day/full_year, x:xx:xx AM/PM
   * @param epochMS: time since epoch in MS 
   * @return: the formatted string 
   */

  const epochDate = new Date(epochMS); 
  return epochDate.toLocaleString("en-US"); 
}
window.convertTimestamp = convertTimestamp; 

export function createButtonSVG(button) {
  /** 
   * @brief: Dynamically creates an editSVG element for the specified button
   * @note: Doing this to allow for coloring of the editSVG via Tailwind
   * @param button: The button name 
   * @return: The final editSVG element
   */

  if (button === "edit") return createEditSVG(); 
  else if (button === "delete") return createDeleteSVG();
  else if (button === "recover") return createRecoverSVG(); 
}

function createEditSVG() {
  /**
   * @briefs: Creates the correct SVG element for the edit button
   * @note: Helper for createButtonSVG()
   * @return: The final SVG element 
   */

  // Create & set the edit button 
  const editSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  editSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  editSVG.setAttribute("viewBox", "0 0 32 32");
  editSVG.setAttribute("fill", "currentColor");
  editSVG.setAttribute("class", "w-6 h-6 text-midnight-text");

  // Create the SVG's path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z");
  editSVG.appendChild(path);

  // Return the final SVG
  return editSVG;
}

function createDeleteSVG() {
  /**
   * @briefs: Creates the correct SVG element for the delete button
   * @note: Helper for createButtonSVG()
   * @return: The final SVG element 
   */

  // Create & set the delete button 
  const deleteSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  deleteSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  deleteSVG.setAttribute("viewBox", "0 0 32 32");
  deleteSVG.setAttribute("fill", "currentColor");
  deleteSVG.setAttribute("class", "w-6 h-6 text-midnight-text");

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
   * @note: Helper for createButtonSVG()
   * @return: The final SVG element 
   */

  // Create & set the recover button 
  const recoverSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  recoverSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  recoverSVG.setAttribute("viewBox", "0 0 32 32");
  recoverSVG.setAttribute("fill", "currentColor");
  recoverSVG.setAttribute("class", "w-6 h-6 text-midnight-text");

  // Create the SVG's path
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 L 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 C 19.875 5 23.261719 6.984375 25.21875 10 L 20 10 L 20 12 L 28 12 L 28 4 L 26 4 L 26 7.71875 C 23.617188 4.84375 20.019531 3 16 3 Z");
  recoverSVG.appendChild(path);

  // Return the final SVG
  return recoverSVG;
}