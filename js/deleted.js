// Imports
import {
  notesById,
  notesByOrder,
  notesDeletedByOrder,
  convertTimestamp,
  render
} from "./global.js"; 
import {
  injectModalTemplate
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
  render("deleted"); 
}); 

// Functions 
export function renderDeleted() {
   // Clear before rendering 
  notesContainer.innerHTML = ""; 

  // Show all notes ascending by time
  for (const uniqueId of notesDeletedByOrder) {
    // Create note-card 
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");
    noteCard.id = `note-${uniqueId}`;  

    // Add note-timestamp
    const noteTimestamp = document.createElement("div"); 
    noteTimestamp.classList.add("note-timestamp"); 
    noteCard.append(noteTimestamp); 
    noteTimestamp.textContent = "Deleted " + convertTimestamp(notesById[uniqueId].deletedAt); 

    // Add note-content 
    const noteContent = document.createElement("div");
    noteContent.classList.add("note-content"); 
    noteCard.append(noteContent);
    noteContent.textContent = notesById[uniqueId].content; 

    // Add note-icons 
    const noteActions = document.createElement("div"); 
    noteActions.classList.add("note-actions-row"); 
    noteCard.append(noteActions);

    const recoverButton = document.createElement("button"); 
    recoverButton.classList.add("icon", "recover-button");
    recoverButton.addEventListener("click", () => {
      recoverNote(uniqueId); 
    }); 
    noteActions.append(recoverButton);

    // Append final note-card to notesContainer
    notesContainer.append(noteCard); 
  }
}

function recoverNote(uniqueId) {
  /**
   * @brief: Recovers a deleted note 
   * @param uniqueId: The unique id of the note to recover
   * @return: nothing (void)
   */

  const cardToRecover = document.getElementById(`note-${uniqueId}`); 
  if (cardToRecover) {
    notesById[uniqueId].isDeleted = false; 
    notesById[uniqueId].deletedAt = null; 
    localStorage.setItem("notesById", JSON.stringify(notesById));

    notesByOrder.splice(findInsertIndex(uniqueId), 0, uniqueId); 
    localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder)); 

    notesDeletedByOrder.splice(notesDeletedByOrder.indexOf(uniqueId), 1); 
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(notesDeletedByOrder)); 
    
    cardToRecover.remove();                               
  }
}

function findInsertIndex(uniqueId) {
  /**
   * @brief: Finds the proper placement of uniqueId in notesByOrder
   * @note: helper for recoverNote()
   * @note: Same problem as Leetcode's Search Insert Position (https://leetcode.com/problems/search-insert-position/description/)
   * @note: Used GeeksForGeeks solution (https://www.geeksforgeeks.org/dsa/search-insert-position-of-k-in-a-sorted-array/)
   * @param uniqueId: The unique id of the note to recover 
   * @return: the correct index to insert into 
   */

  // Edge case: If notesByOrder is empty, return 0 
  if (notesByOrder.length === 0) return 0; 

  // Get note to recover's timestamp 
  const noteToRecover = notesById[uniqueId]; 
  const noteToRecoverTimestamp = noteToRecover.lastChangeAt; 

  // Use binary search to find index 
  /** @note: Remember that notesByOrder is by timestamp DESCENDING! */
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
