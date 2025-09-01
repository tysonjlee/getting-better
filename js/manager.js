// Imports
import {} from "./global.js";

// Constants & Variables  
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "manager"; 

// Event Listeners 

// Functions 
export function renderManager() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const id of window.App.notesByOrder) {
    // Create & append note card to notesContainer
    const noteCard = window.App.createNoteCardElement(id, {timestamp: window.App.notesById[id].lastChangeAt, pinned: window.App.notesById[id].pinned, showButtons: true, buttons: {pinButton: true, editButton: true, deleteButton: true}});
    notesContainer.append(noteCard); 
  }
}
