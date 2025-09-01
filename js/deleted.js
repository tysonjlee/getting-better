// Imports
import {
  createNoteCardElement
} from "./global.js"; 

// Constants & Variables
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "deleted"; 

// Event Listeners

// Functions 
export function renderDeleted() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const id of window.notesDeletedByOrder) {
    // Create note-card 
    const noteCard = createNoteCardElement(id, {timestamp: window.notesById[id].deletedAt, pinned: window.notesById[id].pinned, showButtons: true, buttons: {recoverButton: true}});

    // Append final note-card to notesContainer
    notesContainer.append(noteCard); 
  }
}
