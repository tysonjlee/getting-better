// Saved Notes
const savedNotes = []; 
const notesSection = document.getElementById("notes-section");


// Saving a Note
const saveButton = document.getElementById("save-button"); 
const note = document.getElementById("user-note"); 
saveButton.onclick = saveNote; 
function saveNote() {
  console.log("Saving the note: " + note.value); 
  savedNotes.push(note.value); 
  notesSection.innerHTML = savedNotes.join("<br>"); 
}