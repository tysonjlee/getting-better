// Constants & Variables
const notesSection = document.getElementById("notes-section");
const noteCards = document.querySelectorAll("#notes-section .note-card"); 
const saveButton = document.getElementById("save-button"); 
const note = document.getElementById("user-note"); 

// Event listeners 
window.onload = render;
saveButton.onclick = saveNote; 

// Functions
function render() {
  // Show notes 
  for (let i = 0; i < 6; ++i) {
    // Exit if no more saved cards to show 
    if (i + 1 > savedNotes.length) break; 

    noteCards[i].textContent = savedNotes[i];
  }
}

function saveNote() {
  // Saving to local storage
  savedNotes.unshift(note.value); // Push newest note to BEGINNING of array
  localStorage.setItem("notes", JSON.stringify(savedNotes)); 

  // Updating notes display
  render(); // TODO: Make this more efficient (i.e. If possible, don't call render() and instead show the next card manually)
}
