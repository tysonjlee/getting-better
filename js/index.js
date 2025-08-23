// Imports
import {
  notesById,
  notesByOrder,
  render
} from "./global.js";

import {
  injectModalTemplate
} from "./modal.js"

// Constants & Variables
window.currentPage = "home"; 

// Event listeners 
window.addEventListener("load", async () => {
  await injectModalTemplate(); 
  render("home"); 
});

// Functions
export function renderHome() {
  // Show notes 
  const noteCards = document.querySelectorAll("#notes-section .note-card"); 
  for (let i = 0; i < 6 && i + 1 <= notesByOrder.length; ++i) {
    noteCards[i].textContent = notesById[notesByOrder[i]].content;
  }
}
