// Imports
import {
  notesById,
  notesByOrder,
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
window.currentPage = "home"; 

// Event listeners 
window.addEventListener("load", async () => {
  await injectNavBarTemplate(); 
  await injectModalTemplate(); 
  setupModalListeners(); 
  render("home"); 
});

// Functions
export function renderHome() {
  /**
   * @brief: Renders the home page 
   * @return: nothing (void)
   */

  // Clear the notes container
  const notesContainer = document.getElementById("notes-container-id"); 
  notesContainer.innerHTML = ""; 

  // Show 4 most recent notes
  for (let i = 0; i < 4 && i + 1 <= notesByOrder.length; ++i) {
    const noteCard = document.createElement("div"); 
    noteCard.className = "note-card"; 
    const noteContent = document.createElement("div"); 
    noteContent.className = "note-content";
    noteContent.textContent = notesById[notesByOrder[i]].content; 
    noteCard.append(noteContent); 
    notesContainer.append(noteCard); 
  }
}
