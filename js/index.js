// Imports
import {
  render, 
  createNoteCardElement
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
  render(window.currentPage); 
});

// Functions
export function renderHome() {
  /**
   * @brief Renders the home page 
   * @return nothing (void)
   */

  // Render the dashboard 
  renderDashboard(); 

  // Render the search query // TODO: Implement 
}

function renderDashboard() {
  /**
   * @brief Renders the dashboard
   * @note Helper for renderHome()
   * @return nothing (void)
   */
  // Clear the notes container
  const notesContainer = document.getElementById("notes-container-id"); 
  notesContainer.innerHTML = ""; 

  // Show 4 most recent notes
  // Show pinned first 
  let displayedNotes = []; // Note id's
  let i = 0; 
  const mergedNotes = window.notesPinnedByOrder.concat(window.notesByOrder); // Still contains duplicate ids! 
  for (const id of mergedNotes) {
    if (i > 3) break; 
    if (displayedNotes.includes(id)) continue; 
    const noteCard = createNoteCardElement(id, {pinned: window.notesById[id].pinned}); 
    notesContainer.append(noteCard); 
    displayedNotes.push(id); 
    ++i; 
  }
}
