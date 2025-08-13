// Constants & Variables
const savedNotes = JSON.parse(localStorage.getItem("notes")) || []; // Parses local storage for saved notes or, if none present, creates an empty array by default 
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

    // FIXME: Delete testing
    console.log("Displaying the note: " + savedNotes[i]); 
  }
}

function saveNote() {
  // Logging in console
  console.log("Saving the note: " + note.value); 

  // Saving to local storage
  savedNotes.unshift(note.value); // Push newest note to BEGINNING of array
  localStorage.setItem("notes", JSON.stringify(savedNotes)); 

  // Updating notes display
  render(); // TODO: Make this more efficient (i.e. If possible, don't call render() and instead show the next card manually)
}
