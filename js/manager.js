// Imports
import {
  createNoteCardElement, 
  render
} from "./global.js";
import {
  injectModalTemplate,
  setupModalListeners
} from "./modal.js"
import {
  injectNavBarTemplate
} from "./navbar.js"

// Constants & Variables  
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "manager"; 

// Event Listeners 
window.addEventListener("load", async () => {
  await injectNavBarTemplate(); 
  await injectModalTemplate(); 
  setupModalListeners(); 
  render(window.currentPage); 
}); 


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
