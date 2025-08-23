// Imports
import {
  notesById,
  notesByOrder,
  notesDeletedByOrder,
  convertTimestamp, 
  render
} from "./global.js";

import {
  injectModalTemplate,
  loadModal
} from "./modal.js"

// Constants & Variables  
const notesSection = document.getElementById("notes-section");
window.currentPage = "manager"; 

// Event Listeners 
window.addEventListener("load", async () => {
  await injectModalTemplate(); 
  render("manager"); 
}); 


// Functions 
export function renderManager() {
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
    deleteButton.addEventListener("click", () => {
      deleteNote(uniqueId); 
    }); 
    noteActions.append(deleteButton);

    const editButton = document.createElement("button"); 
    editButton.classList.add("icon", "edit-button");
    editButton.addEventListener("click", () => {
      loadModal("edit", {noteId: uniqueId}, {notesById, notesByOrder, render: () => render("manager")});  
    }); 
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
