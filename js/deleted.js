// Imports
import {
  notesById,
  notesByOrder,
  notesDeletedByOrder,
  convertTimestamp,
  createSVG,
  render
} from "./global.js"; 
import {
  injectModalTemplate, 
  setupModalListeners
} from "./modal.js"
import {
  injectNavBarTemplate
} from "./navbar.js"

// Constants & Variables
const notesContainer = document.getElementById("notes-container-id");
window.currentPage = "deleted"; 

// Event Listeners
window.addEventListener("load", async () => {
  await injectNavBarTemplate(); 
  await injectModalTemplate(); 
  setupModalListeners(); 
  render("deleted"); 
}); 

// Functions 
export function renderDeleted() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const id of notesDeletedByOrder) {
    // Create note-card 
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");
    noteCard.id = `note-${id}`;  

    // Add note-timestamp
    const noteTimestamp = document.createElement("div"); 
    noteTimestamp.classList.add("note-timestamp"); 
    noteCard.append(noteTimestamp); 
    noteTimestamp.textContent = "Deleted " + convertTimestamp(notesById[id].deletedAt); 

    // Add note-content 
    const noteContent = document.createElement("div");
    noteContent.classList.add("note-content"); 
    noteCard.append(noteContent);
    noteContent.textContent = notesById[id].content; 

    // Add note-icons 
    const noteActions = document.createElement("div"); 
    noteActions.classList.add("note-actions-row"); 
    noteCard.append(noteActions);

    const recoverButton = document.createElement("button"); 
    recoverButton.className = "button-icon"; 
    const recoverSVG = createSVG("recover"); 
    recoverButton.append(recoverSVG); 
    recoverButton.addEventListener("click", () => {
      recoverNote(id); 
    }); 
    noteActions.append(recoverButton);

    // Append final note-card to notesContainer
    notesContainer.append(noteCard); 
  }
}

function recoverNote(id) {
  /**
   * @brief Recovers a deleted note 
   * @param id The unique id of the note to recover
   * @return nothing (void)
   */

  const cardToRecover = document.getElementById(`note-${id}`); 
  if (cardToRecover) {
    notesById[id].isDeleted = false; 
    notesById[id].deletedAt = null; 
    localStorage.setItem("notesById", JSON.stringify(notesById));

    notesByOrder.splice(findInsertIndex(id), 0, id); 
    localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder)); 

    notesDeletedByOrder.splice(notesDeletedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(notesDeletedByOrder)); 
    
    cardToRecover.remove();                               
  }
}

function findInsertIndex(id) {
  /**
   * @brief Finds the proper placement of id in notesByOrder
   * @note helper for recoverNote()
   * @note Same problem as Leetcode's Search Insert Position (https://leetcode.com/problems/search-insert-position/description/)
   * @note Used GeeksForGeeks solution (https://www.geeksforgeeks.org/dsa/search-insert-position-of-k-in-a-sorted-array/)
   * @param id The unique id of the note to recover 
   * @return the correct index to insert into 
   */

  // Edge case: If notesByOrder is empty, return 0 
  if (notesByOrder.length === 0) return 0; 

  // Get note to recover's timestamp 
  const noteToRecover = notesById[id]; 
  const noteToRecoverTimestamp = noteToRecover.lastChangeAt; 

  // Use binary search to find index 
  /** @note Remember that notesByOrder is by timestamp DESCENDING! */
  let lo = 0; 
  let hi = notesByOrder.length - 1; 
  while (lo < hi) {
    // Get middle object's timestamp 
    let mid = Math.floor(lo + (hi - lo) / 2); 
    let midNote = notesById[notesByOrder[mid]];
    let midTimestamp = midNote.lastChangeAt; 

    // If mid is less than our timestamp, adjust window left 
    if (midTimestamp <= noteToRecoverTimestamp) hi = mid; 

    // Otherwise, adjust window right 
    else lo = mid + 1; 
  }

  // arr[lo] is the first element <= ourTimestamp
  if (notesById[notesByOrder[lo]].lastChangeAt > noteToRecoverTimestamp) return lo + 1; 
  else return lo;  
}
