// Constants & Variables
const notesSection = document.getElementById("notes-section");
const noteCards = document.querySelectorAll("#notes-section .note-card"); 
const saveButton = document.getElementById("save-button"); 
const newNote = document.getElementById("user-note"); 

// Event listeners 
window.onload = render;
saveButton.onclick = saveNote; 

// Functions
function render() {
  // Show notes 
  for (let i = 0; i < 6; ++i) {
    if (i + 1 > notesByOrder.length) break; // Exit if no more saved cards to show 
    noteCards[i].textContent = notesById[notesByOrder[i]].content;
  }
}

function saveNote() {
  // Saving to local storage
  const randomId = crypto.randomUUID(); 
  notesById[randomId] = {"content": newNote.value, "timestamp": Date.now()}; 
  notesByOrder.unshift(randomId); 
  localStorage.setItem("notesById", JSON.stringify(notesById)); 
  localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder)); 
  
  // Updating notes display
  render(); // TODO: Make this more efficient (i.e. If possible, don't call render() and instead show the next card manually)
}
