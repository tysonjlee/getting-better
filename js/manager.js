// Constants & Variables 
const notesSection = document.getElementById("notes-section");

// Event Listeners 
window.onload = render; 

// Functions 
function render() {
  // Show all notes 
  for (const uniqueId of notesByOrder) {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card"); 
    noteCard.textContent = notesById[uniqueId].content; 
    notesSection.append(noteCard); 
  }
}

// TODO: Implement functions below 
function deleteNote() {

}

function editNote() {

}