// Imports
import {} from "./global.js"; 

// Constants & Variables
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "deleted"; 

// Event Listeners

// Functions 
export async function renderDeleted() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const id of window.App.notesDeletedByOrder) {
    // Create note-card 
    const noteCard = await window.App.createNoteCardElement(id);

    // Append final note-card to notesContainer
    notesContainer.append(noteCard); 
  }
}
