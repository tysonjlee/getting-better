// Imports
import {
  notesById,
  notesByOrder,
  notesDeletedByOrder,
  convertTimestamp, 
  createButtonSVG,
  render
} from "./global.js";
import {
  injectModalTemplate,
  setupModalListeners,
  loadModal
} from "./modal.js"
import {
  injectNavBarTemplate
} from "./navbar.js"

// Constants & Variables  
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "manager"; 

// Event Listeners 
window.addEventListener("load", async () => {
  await injectNavBarTemplate(); 
  await injectModalTemplate(); 
  setupModalListeners(); 
  render(window.currentPage); 
}); 


// Functions 
export function renderManager() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const uniqueId of notesByOrder) {
    // Create note-card 
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.id = `note-${uniqueId}`;  

    // Add note-timestamp
    const noteTimestamp = document.createElement("div"); 
    noteTimestamp.className = "note-timestamp"; 
    noteCard.append(noteTimestamp); 
    if (notesById[uniqueId].wasUpdated) noteTimestamp.textContent = "Edited " + convertTimestamp(notesById[uniqueId].updatedAt); 
    else noteTimestamp.textContent = "Created " + convertTimestamp(notesById[uniqueId].createdAt);  

    // Add note-content 
    const noteContent = document.createElement("div");
    noteContent.className = "note-content"; 
    noteCard.append(noteContent);
    noteContent.textContent = notesById[uniqueId].content; 

    // Add note actions
    const noteActions = document.createElement("div"); 
    noteActions.className = "note-actions-row"
    noteCard.append(noteActions);

    const deleteButton = document.createElement("button"); 
    deleteButton.className = "icon"; 
    const deleteSVG = createButtonSVG("delete"); 
    deleteButton.append(deleteSVG); 
    deleteButton.addEventListener("click", () => {
      deleteNote(uniqueId); 
    }); 
    noteActions.append(deleteButton);

    const editButton = document.createElement("button"); 
    editButton.className = "icon"; 
    const editSVG = createButtonSVG("edit"); 
    editButton.append(editSVG); 
    editButton.addEventListener("click", () => {
      loadModal("edit", {noteId: uniqueId}, {notesById, notesByOrder, render: () => render("manager")});  
    }); 
    noteActions.append(editButton);

    // Append final note-card to notesContainer
    notesContainer.append(noteCard); 
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
