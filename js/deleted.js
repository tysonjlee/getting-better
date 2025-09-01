// Imports
import {} from "./global.js"; 

// Constants & Variables
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "deleted"; 

// Event Listeners

// Functions 
export function renderDeleted() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const id of window.App.notesDeletedByOrder) {
    // Create note-card 
    const noteCard = window.App.createNoteCardElement(id, {timestamp: window.App.notesById[id].deletedAt, pinned: window.App.notesById[id].pinned, showButtons: true, buttons: {recoverButton: true}});

    // Append final note-card to notesContainer
    notesContainer.append(noteCard); 
  }
}
