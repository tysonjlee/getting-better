// Imports
import {} from "./global.js";

// Constants & Variables  
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "manager"; 

// Event Listeners 

// Functions 
export async function renderManager() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all active notes first (ascending by time)
  for (const id of window.App.notesByOrder) {
    // Create & append note card to notesContainer
    const noteCard = await window.App.createNoteCardElement(id);
    notesContainer.append(noteCard); 
  }

  // Show all deleted notes next (ascending by time)
  for (const id of window.App.notesDeletedByOrder) {
    const noteCard = await window.App.createNoteCardElement(id);
    notesContainer.append(noteCard);  
  }
}
