/** @note Make sure each js file imports from this global file! */

// Imports 
import {
  injectNavBarTemplate
} from "./navbar.js"; 
import {
  injectCreateModalTemplate, 
  setupModalListeners,
  loadModal, 
  openNoteModal
} from "./modal.js"; 

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
 *    "pinned": boolean
 *   }
 *   ...
 * }
 */

export const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of note ID's descending by timestamp created/edited
window.notesByOrder = notesByOrder; 
// notesByOrder = ["uniqueId20", "uniqueId19", "uniqueId18", ...]

export const notesPinnedByOrder = JSON.parse(localStorage.getItem("notesPinnedByOrder")) || []; // Array of pinned note ID's descending by timestamp pinned
window.notesPinnedByOrder = notesPinnedByOrder; 

export const notesDeletedByOrder = JSON.parse(localStorage.getItem("notesDeletedByOrder")) || []; // Array of deleted note ID's descending by timestamp deleted
window.notesDeletedByOrder = notesDeletedByOrder; 
// notesDeletedByOrder = ["uniqueId200", "uniqueId199", "uniqueId198", ...]

// Event Listeners 

// Functions 
export async function render(page) {
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
window.render = render; 


// Event Listeners
window.addEventListener("load", async () => {
  await injectNavBarTemplate(); 
  await injectCreateModalTemplate(); 
  setupModalListeners(); 
  render(window.currentPage); 
});

// Functions
export function createNoteCardElement(id, options = {}) {
  /**
   * @brief Creates a note card div element for an already existing note (id)
   * @param id: The id of the note to target 
   * @param options Optional buttons, pin icon, etc. 
   * @return The final note card 
   */

  // Populate options
  const {
    timestamp = null,
    pinned = false,
    showButtons = false,
    buttons = {},
  } = options; 

  const {
    pinButton = false, 
    editButton = false, 
    deleteButton = false, 
    recoverButton = false
  } = buttons; 

  // Create note-card 
  const noteCard = document.createElement("div");
  noteCard.className = "note-card";
  noteCard.id = `note-${id}`;  

  // Add event listener for note modal 
  noteCard.addEventListener("click", () => {
    openNoteModal(); 
  }); 

  // Add top row div 
  const topRowDiv = document.createElement("div"); 
  topRowDiv.className = "flex justify-between items-start min-h-[24px] w-full"
  noteCard.append(topRowDiv); 

  // OPTIONAL: Timestamp
  if (timestamp) {
    const noteTimestamp = document.createElement("div"); 
    noteTimestamp.className = "note-timestamp"; 
    topRowDiv.append(noteTimestamp); 
    if (notesById[id].wasUpdated) noteTimestamp.textContent = "Edited " + convertTimestamp(notesById[id].updatedAt); 
    else noteTimestamp.textContent = "Created " + convertTimestamp(notesById[id].createdAt);  
  }

  // OPTIONAL: Pin icon
  if (pinned) {
    const pinStatusSVG = createSVG("pin-status"); 
    topRowDiv.append(pinStatusSVG); 
  }

  // Add content
  const noteContent = document.createElement("div");
  noteContent.className = "note-content"; 
  noteCard.append(noteContent);
  noteContent.textContent = notesById[id].content; 

  // Add bottom row div (actions/buttons)
  const noteActions = document.createElement("div"); 
  noteActions.className = "note-actions-row"
  noteCard.append(noteActions);

  // OPTIONAL: Actions (buttons)
  if (showButtons) {
    // OPTIONAL: Pin button
    if (pinButton) {
      const pinButton = document.createElement("button"); 
      pinButton.className = "button-icon"; 
      const pinSVG = createSVG("pin-button"); 
      pinButton.append(pinSVG); 
      pinButton.addEventListener("click", () => {
        togglePin(id); 
      }); 
      noteActions.append(pinButton);
    }

    // OPTIONAL: Delete button
    if (deleteButton) {
      const deleteButton = document.createElement("button"); 
      deleteButton.className = "button-icon"; 
      const deleteSVG = createSVG("delete"); 
      deleteButton.append(deleteSVG); 
      deleteButton.addEventListener("click", () => {
        deleteNote(id); 
      }); 
      noteActions.append(deleteButton);
    }

    // OPTIONAL: Edit button
    if (editButton) {
      const editButton = document.createElement("button"); 
      editButton.className = "button-icon"; 
      const editSVG = createSVG("edit"); 
      editButton.append(editSVG); 
      editButton.addEventListener("click", () => {
        loadModal("edit", {noteId: id});  
      }); 
      noteActions.append(editButton);
    }

    // OPTIONAL: Recover button 
    if (recoverButton) {
      const recoverButton = document.createElement("button"); 
      recoverButton.className = "button-icon"; 
      const recoverSVG = createSVG("recover"); 
      recoverButton.append(recoverSVG);  
      recoverButton.addEventListener("click", () => {
        recoverNote(id); 
      }); 
      noteActions.append(recoverButton);
    }
  }

  // Return the final note card
  return noteCard; 
}

function deleteNote(id) {
  /**
   * @brief Deletes the specified note 
   * @param id The unique id of the note to delete 
   * @return nothing (void)
   */

  const cardToDelete = document.getElementById(`note-${id}`);
  if (cardToDelete) { // Safe-check to make sure we got a valid element
    notesById[id].isDeleted = true; 
    notesById[id].deletedAt = Date.now(); 
    notesById[id].pinned = false;     
    localStorage.setItem("notesById", JSON.stringify(notesById)); 

    notesByOrder.splice(notesByOrder.indexOf(id), 1);
    localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder)); 

    notesPinnedByOrder.splice(notesPinnedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesPinnedByOrder", JSON.stringify(notesPinnedByOrder)); 

    notesDeletedByOrder.unshift(id);               
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(notesDeletedByOrder)); 

    cardToDelete.remove();                               
  }
}

function togglePin(id) {
  /** 
   * @brief Toggles the pin on the specified note
   * @note Helper for createNoteCardElement()
   * @param id The unique id of the relative note
   * @return nothing (void)
   */
  
  // If toggling pin on 
  if (!notesById[id].pinned) {
    notesById[id].pinned = true; 
    localStorage.setItem("notesById", JSON.stringify(notesById)); 
    notesPinnedByOrder.unshift(id); 
    localStorage.setItem("notesPinnedByOrder", JSON.stringify(notesPinnedByOrder)); 
  } 

  // Otherwise if toggling pin off 
  else {
    notesById[id].pinned = false; 
    localStorage.setItem("notesById", JSON.stringify(notesById)); 
    notesPinnedByOrder.splice(notesPinnedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesPinnedByOrder", JSON.stringify(notesPinnedByOrder));     
  }
  
  render(window.currentPage); 
}

function recoverNote(id) {
  /**
   * @brief Recovers a deleted note 
   * @note Helper for createNoteCardElement()
   * @param id The unique id of the note to recover
   * @return nothing (void)
   */

  const cardToRecover = document.getElementById(`note-${id}`); 
  if (cardToRecover) {
    window.notesById[id].isDeleted = false; 
    window.notesById[id].deletedAt = null; 
    localStorage.setItem("notesById", JSON.stringify(window.notesById));

    window.notesByOrder.splice(findInsertIndex(id), 0, id); 
    localStorage.setItem("notesByOrder", JSON.stringify(window.notesByOrder)); 

    window.notesDeletedByOrder.splice(window.notesDeletedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(window.notesDeletedByOrder)); 
    
    cardToRecover.remove();                               
  }
}

function findInsertIndex(id) {
  /**
   * @brief Finds the proper placement of id in notesByOrder
   * @note helper for recoverNote()
   * @note Same problem as Leetcode's Search Insert Position (https://leetcode.com/problems/search-insert-position/description/)
   * @note Used GeeksForGeeks solution (https://www.geeksforgeeks.org/dsa/search-insert-position-of-k-in-a-sorted-array/)
   * @param id The unique id of the note to recover 
   * @return the correct index to insert into 
   */

  // Edge case: If notesByOrder is empty, return 0 
  if (window.notesByOrder.length === 0) return 0; 

  // Get note to recover's timestamp 
  const noteToRecover = window.notesById[id]; 
  const noteToRecoverTimestamp = noteToRecover.lastChangeAt; 

  // Use binary search to find index 
  /** @note Remember that notesByOrder is by timestamp DESCENDING! */
  let lo = 0; 
  let hi = window.notesByOrder.length - 1; 
  while (lo < hi) {
    // Get middle object's timestamp 
    let mid = Math.floor(lo + (hi - lo) / 2); 
    let midNote = window.notesById[window.notesByOrder[mid]];
    let midTimestamp = midNote.lastChangeAt; 

    // If mid is less than our timestamp, adjust window left 
    if (midTimestamp <= noteToRecoverTimestamp) hi = mid; 

    // Otherwise, adjust window right 
    else lo = mid + 1; 
  }

  // arr[lo] is the first element <= ourTimestamp
  if (window.notesById[window.notesByOrder[lo]].lastChangeAt > noteToRecoverTimestamp) return lo + 1; 
  else return lo;  
}

export function createSVG(type) {
  /** 
   * @brief Dynamically creates an SVG element of the specified type
   * @note Doing this to allow for coloring of the editSVG via Tailwind
   * @param type The type of SVG (see below)
   * @return The final SVG element
   */

  if (type === "edit") return createEditSVG(); 
  else if (type === "delete") return createDeleteSVG();
  else if (type === "recover") return createRecoverSVG(); 
  else if (type === "pin-button") return createPinButtonSVG(); 
  else if (type === "pin-status") return createPinStatusSVG(); 
}

function createEditSVG() {
  /**
   * @briefs: Creates the correct SVG element for the edit button
   * @note Helper for createSVG()
   * @return The final SVG element 
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
   * @note Helper for createSVG()
   * @return The final SVG element 
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
   * @note Helper for createSVG()
   * @return The final SVG element 
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
  pinSVG.setAttribute("class", "w-6 h-6 text-midnight-text");

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

export function convertTimestamp(epochMS) {
  /**
   * @brief Converts time since epoch in MS to a formatted date string to be shown on a note card 
   * @note formatted as month/day/full_year, x:xx:xx AM/PM
   * @param epochMS time since epoch in MS 
   * @return the formatted string 
   */

  const epochDate = new Date(epochMS); 
  return epochDate.toLocaleString("en-US"); 
}
