// Constants & Variables 
const notesSection = document.getElementById("notes-section");

// Event Listeners 
window.onload = render; 

// Functions 
function render() {
  // Clear before rendering 
  notesSection.innerHTML = ""; 

  // Show all notes ascending by time
  for (const uniqueId of notesByOrder) {
    // Create note-card 
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card"); 

    // Add note-timestamp
    const noteTimestamp = document.createElement("div"); 
    noteTimestamp.classList.add("note-timestamp"); 
    noteCard.append(noteTimestamp); 
    noteTimestamp.textContent = "Created " + convertTimestamp(notesById[uniqueId].timestamp); 

    // Add note-content 
    const noteContent = document.createElement("div");
    noteContent.classList.add("note-content"); 
    noteCard.append(noteContent);
    noteContent.textContent = notesById[uniqueId].content; 

    // Add note-icons 
    const noteActions = document.createElement("div"); 
    noteActions.classList.add("note-actions"); 
    noteCard.append(noteActions);

    const deleteButton = document.createElement("button"); 
    deleteButton.classList.add("icon", "delete-button");
    deleteButton.onclick = deleteNote; 
    noteActions.append(deleteButton);

    const editButton = document.createElement("button"); 
    editButton.classList.add("icon", "edit-button");
    editButton.onclick = editNote; 
    noteActions.append(editButton);

    // Append final note-card to notesSection
    notesSection.append(noteCard); 
  }
}

function deleteNote(uniqueId) {
  /**
   * @brief: Deletes a note 
   * @param uniqueId: The unique id of the note to delete 
   * @return: nothing 
   */


}

function editNote() {
}

function saveNote() {

}

function convertTimestamp(epochMS) {
  /**
   * @brief: Converts time since epoch in MS to a formatted date string to be shown on a note card 
   * @param epochMS: time since epoch in MS 
   * @return: the formatted string 
   */

  const epochDate = new Date(epochMS); 
  return epochDate.toLocaleString("en-US"); 
}