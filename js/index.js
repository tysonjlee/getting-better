// Imports
import {
  notesById,
  notesByOrder,
  notesPinnedByOrder,
  render, 
  createSVG
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
  for (const id of notesPinnedByOrder) {
    if (i > 3) break; 
    const noteCard = document.createElement("div"); 
    noteCard.className = "note-card"; 
    const topRowDiv = document.createElement("div"); 
    topRowDiv.className = "flex justify-end items-start w-full"
    noteCard.append(topRowDiv); 
    const pinStatusSVG = createSVG("pin-status"); 
    topRowDiv.append(pinStatusSVG); 
    const noteContent = document.createElement("div"); 
    noteContent.className = "note-content";
    noteContent.textContent = notesById[id].content; 
    noteCard.append(noteContent); 
    notesContainer.append(noteCard); 
    displayedNotes.unshift(id); 
    ++i; 
  }

  // Show remaining cards if needed 
  if (i < 4) {
    for (const id of notesByOrder) {
      if (i > 3) break; 
      if (displayedNotes.includes(id)) continue; 
      const noteCard = document.createElement("div"); 
      noteCard.className = "note-card"; 
      const noteContent = document.createElement("div"); 
      noteContent.className = "note-content";
      noteContent.textContent = notesById[id].content; 
      noteCard.append(noteContent); 
      notesContainer.append(noteCard); 
      displayedNotes.unshift(id); 
      ++i; 
    }
  }
}
