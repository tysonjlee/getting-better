// Imports
import {
  createNoteCardElement, 
} from "./global.js";

// Constants & Variables  
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "manager"; 

// Event Listeners 

// Functions 
export function renderManager() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const id of window.notesByOrder) {
    // Create & append note card to notesContainer
    const noteCard = createNoteCardElement(id, {timestamp: window.notesById[id].lastChangeAt, pinned: window.notesById[id].pinned, showButtons: true, buttons: {pinButton: true, editButton: true, deleteButton: true}});
    notesContainer.append(noteCard); 
  }
}
