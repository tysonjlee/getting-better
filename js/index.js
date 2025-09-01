// Imports
import {} from "./global.js";

// Constants & Variables
window.currentPage = "home"; 

// Event Listeners

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
  const mergedNotes = window.App.notesPinnedByOrder.concat(window.App.notesByOrder); // Still contains duplicate ids! 
  for (const id of mergedNotes) {
    if (i > 3) break; 
    if (displayedNotes.includes(id)) continue; 
    const noteCard = window.App.createNoteCardElement(id, {pinned: window.App.notesById[id].pinned}); 
    notesContainer.append(noteCard); 
    displayedNotes.push(id); 
    ++i; 
  }
}
