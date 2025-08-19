// Constants & Variables 
const notesSection = document.getElementById("notes-section");

// Event Listeners
window.onload = render; 

// Functions 
function render() {
   // Clear before rendering 
  notesSection.innerHTML = ""; 

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
    noteActions.classList.add("note-actions"); 
    noteCard.append(noteActions);

    const recoverButton = document.createElement("button"); 
    recoverButton.classList.add("icon", "recover-button");
    recoverButton.onclick = () => recoverNote(uniqueId); 
    noteActions.append(recoverButton);

    // Append final note-card to notesSection
    notesSection.append(noteCard); 
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

    notesByOrder.splice(findIndex(uniqueId), 0, uniqueId); 
    localStorage.setItem("notesByOrder", JSON.stringify(notesByOrder)); 

    notesDeletedByOrder.splice(notesDeletedByOrder.indexOf(uniqueId)); 
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(notesDeletedByOrder)); 
    
    cardToRecover.remove();                               
  }
}

function findIndex(uniqueId) {
  /**
   * @brief: Finds the proper placement of uniqueId in notesByOrder
   * @note: helper for recoverNote()
   * @param uniqueId: The unique id of the note to recover 
   * @return: the correct index to insert into 
   */

  // Edge case: If notesByOrder is empty, return 0 
  if (notesByOrder.length === 0) return 0; 

  // Get note to recover's timestamp 
  const noteToRecover = notesById[uniqueId]; 
  let noteToRecoverTimestamp; 
  if (noteToRecover.wasUpdated) noteToRecoverTimestamp = noteToRecover.updatedAt; 
  else noteToRecoverTimestamp = noteToRecover.createdAt;

  // Use binary search to find index 
  /** @note: Remember that notesByOrder is by timestamp DESCENDING! */
  let lo = 0; 
  let hi = notesByOrder.length - 1; 
  while (lo <= hi) {
    // Get middle object's timestamp 
    let mid = Math.floor(lo + (hi - lo) / 2); 
    let midNote = notesById[notesByOrder[mid]]; 
    let midTimestamp; 
    if (midNote.wasUpdated) midTimestamp = midNote.updatedAt; 
    else midTimestamp = midNote.createdAt; 

    // If mid is greater than our timestamp, adjust the window right 
    if (midTimestamp > noteToRecoverTimestamp) lo = mid + 1;  

    // Otherwise if mid is less than our timestamp, adjust the window left 
    else if (midTimestamp < noteToRecoverTimestamp) hi = mid - 1;  

    // Otherwise we've found the correct index 
    else return mid; 
  }
}

// FIXME: Delete testing once done with figuring out logic for findIndex()
function testFunction() { 
  // Input
  let arr = [24, 17, 14, 10, 8]; 
  let ourTimestamp = 15; 

  // Binary search logic
  let lo = 0; 
  let hi = arr.length - 1;  
  while (lo < hi) {
    console.log(`New iteration\n`); 
    console.log("lo = " + lo);
    console.log("hi = " + hi); 

    // Get middle object's timestamp 
    const mid = Math.floor(lo + (hi - lo) / 2); 
    const midTimestamp = arr[mid]; 

    // If mid is greater than our timestamp, adjust the window right 
    if (midTimestamp > ourTimestamp) lo = mid + 1;  

    // Otherwise if mid is less than our timestamp, adjust the window left 
    else if (midTimestamp < ourTimestamp) hi = mid;  

    // Otherwise we've found the correct index 
    // FIXME: See if I can get rid of the if check here 
    else return lo; 
  } 

  // Error check 
  return -1; 
}


// [24, 17, 14, 10, 8] - input
//  0   1   2   3   4
// Insert: 15 




// Notes to test: 
  // Active note: be45e6f1-2fe0-44c0-b32e-f7946bc39d83
  // Oldest deleted note: a5f78abb-de1e-4cee-a024-d9a49d09551e
