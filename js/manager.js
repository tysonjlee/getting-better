// Imports
import {
  notesById,
  notesByOrder,
  notesDeletedByOrder,
  convertTimestamp, 
  createSVG,
  render,
  notesPinnedByOrder
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
  for (const id of notesByOrder) {
    // Create note-card 
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.id = `note-${id}`;  

    // Add note-timestamp & pinned status icon
    const topRowDiv = document.createElement("div"); 
    topRowDiv.className = "flex justify-between items-start w-full"
    noteCard.append(topRowDiv); 

    const noteTimestamp = document.createElement("div"); 
    noteTimestamp.className = "note-timestamp"; 
    topRowDiv.append(noteTimestamp); 
    if (notesById[id].wasUpdated) noteTimestamp.textContent = "Edited " + convertTimestamp(notesById[id].updatedAt); 
    else noteTimestamp.textContent = "Created " + convertTimestamp(notesById[id].createdAt);  

    if (notesById[id].pinned) {
      const pinStatusSVG = createSVG("pin-status"); 
      topRowDiv.append(pinStatusSVG); 
    }

    // Add note-content 
    const noteContent = document.createElement("div");
    noteContent.className = "note-content"; 
    noteCard.append(noteContent);
    noteContent.textContent = notesById[id].content; 

    // Add note actions
    const noteActions = document.createElement("div"); 
    noteActions.className = "note-actions-row"
    noteCard.append(noteActions);

    const pinButton = document.createElement("button"); 
    pinButton.className = "button-icon"; 
    const pinSVG = createSVG("pin-button"); 
    pinButton.append(pinSVG); 
    pinButton.addEventListener("click", () => {
      togglePin(id); 
    }); 
    noteActions.append(pinButton);

    const deleteButton = document.createElement("button"); 
    deleteButton.className = "button-icon"; 
    const deleteSVG = createSVG("delete"); 
    deleteButton.append(deleteSVG); 
    deleteButton.addEventListener("click", () => {
      deleteNote(id); 
    }); 
    noteActions.append(deleteButton);

    const editButton = document.createElement("button"); 
    editButton.className = "button-icon"; 
    const editSVG = createSVG("edit"); 
    editButton.append(editSVG); 
    editButton.addEventListener("click", () => {
      loadModal("edit", {noteId: id}, {notesById, notesByOrder, render: () => render("manager")});  
    }); 
    noteActions.append(editButton);

    // Append final note-card to notesContainer
    notesContainer.append(noteCard); 
  }
}

function deleteNote(id) {
  /**
   * @brief Deletes the specified note 
   * @param id The unique id of the note to delete 
   * @return nothing (void)
   */

  const cardToDelete = document.getElementById(`note-${id}`);
  if (cardToDelete) { // Safe-check to make sure we got a valid element
    notesById[id].isDeleted = true; 
    notesById[id].deletedAt = Date.now(); 
    notesById[id].pinned = false;     
    localStorage.setItem("notesById", JSON.stringify(notesById)); 

    notesByOrder.splice(notesByOrder.indexOf(id), 1);
    localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder)); 

    notesPinnedByOrder.splice(notesPinnedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesPinnedByOrder", JSON.stringify(notesPinnedByOrder)); 

    notesDeletedByOrder.unshift(id);               
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(notesDeletedByOrder)); 

    cardToDelete.remove();                               
  }
}

function togglePin(id) {
  /** 
   * @brief Toggles the pin on the specified note
   * @param id The unique id of the relative note
   * @return nothing (void)
   */
  
  // If toggling pin on 
  if (!notesById[id].pinned) {
    notesById[id].pinned = true; 
    localStorage.setItem("notesById", JSON.stringify(notesById)); 
    notesPinnedByOrder.unshift(id); 
    localStorage.setItem("notesPinnedByOrder", JSON.stringify(notesPinnedByOrder)); 
  } 

  // Otherwise if toggling pin off 
  else {
    notesById[id].pinned = false; 
    localStorage.setItem("notesById", JSON.stringify(notesById)); 
    notesPinnedByOrder.splice(notesPinnedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesPinnedByOrder", JSON.stringify(notesPinnedByOrder));     
  }
  
  render("manager"); 
}