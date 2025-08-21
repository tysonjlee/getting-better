// Constants & Variables 
import {
  notesById,
  notesByOrder,
  notesDeletedByOrder,
  convertTimestamp
} from "./global.js";
const notesSection = document.getElementById("notes-section");

// FIXME: Delete testing once done
window.notesById = notesById; 
window.notesByOrder = notesByOrder; 
window.notesDeletedByOrder = notesDeletedByOrder; 
window.convertTimestamp = convertTimestamp; 

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
    noteCard.id = `note-${uniqueId}`;  

    // Add note-timestamp
    const noteTimestamp = document.createElement("div"); 
    noteTimestamp.classList.add("note-timestamp"); 
    noteCard.append(noteTimestamp); 
    if (notesById[uniqueId].wasUpdated) noteTimestamp.textContent = "Edited " + convertTimestamp(notesById[uniqueId].updatedAt); 
    else noteTimestamp.textContent = "Created " + convertTimestamp(notesById[uniqueId].createdAt);  

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
    deleteButton.onclick = () => deleteNote(uniqueId); 
    noteActions.append(deleteButton);

    const editButton = document.createElement("button"); 
    editButton.classList.add("icon", "edit-button");
    editButton.onclick = () => editNote(uniqueId); 
    noteActions.append(editButton);

    // Append final note-card to notesSection
    notesSection.append(noteCard); 
  }
}

function deleteNote(uniqueId) {
  /**
   * @brief: Deletes a note 
   * @param uniqueId: The unique id of the note to delete 
   * @return: nothing (void)
   */

  const cardToDelete = document.getElementById(`note-${uniqueId}`);
  if (cardToDelete) { // Safe-check to make sure we got a valid element
    notesById[uniqueId].isDeleted = true; 
    notesById[uniqueId].deletedAt = Date.now(); 
    localStorage.setItem("notesById", JSON.stringify(notesById)); 

    notesByOrder.splice(notesByOrder.indexOf(uniqueId), 1);
    localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder)); 

    notesDeletedByOrder.unshift(uniqueId);               
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(notesDeletedByOrder)); 

    cardToDelete.remove();                               
  }
}

function editNote(uniqueId) {
  /**
   * @brief: Edits a note 
   * @param uniqueId: The unique id of the note to delete 
   * @return: nothing (void)
   */

  const cardToEdit = document.getElementById(`note-${uniqueId}`); 
  if (cardToEdit) {
    const modal = document.getElementById("modal-backdrop");
    const exitButton = document.getElementById("exit-button-id");
    const saveButton = document.getElementById("save-button-id");
    const contentArea = document.getElementById("content-area");

    contentArea.value = notesById[uniqueId].content; 
    exitButton.onclick = () => exitEdit(modal); 
    saveButton.onclick = () => saveEdit(uniqueId, modal, contentArea.value); 

    modal.classList.remove("hidden");
  } 
}

function saveEdit(uniqueId, modal, newContent) {
  /**
   * @brief: Saves the edited note
   * @note: Helper for editNote()
   * @param uniqueId: The unique id of the edited note to save
   * @param modal: The modal object to hide after saving
   * @param newContent: The new, edited string to be used as the note's content
   * @return: nothing (void)
   */

  // If the content hasn't changed, warn the user 
  // TODO: Implement this 
  if (newContent === notesById[uniqueId].content) {
    console.log("The content is the same!"); 
    return; 
  }

  // Save the edited note 
  const now = Date.now(); 

  const editedNote = notesById[uniqueId]; 
  editedNote.content = newContent; 
  editedNote.wasUpdated = true; 
  editedNote.updatedAt = now; 
  editedNote.lastChangeAt = now; 
  localStorage.setItem("notesById", JSON.stringify(notesById)); 

  notesByOrder.splice(notesByOrder.indexOf(uniqueId), 1); 
  notesByOrder.unshift(uniqueId); 
  localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder));

  // Exit the edit modal
  exitEdit(modal); 
}

function exitEdit(modal) {
  /**
   * @brief: Exits the edit modal 
   * @param modal: The modal object to hide
   * @return: nothing (void)
   */

  // Exit the edit modal 
  modal.classList.add("hidden"); 
  render(); 
}
