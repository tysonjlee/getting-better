// Functions 
export async function injectNoteModalTemplate() {
  // Get the HTML template
  const result = await fetch("../components/note-modal.tpl"); 
  const text = await result.text(); 
  const template = document.createElement("template"); 
  template.innerHTML = text.trim(); 

  // Append before the JS scripts
  const scripts = document.querySelectorAll("script"); 
  const firstScript = scripts[0]; 
  document.body.insertBefore(template.content.firstElementChild, firstScript); 
}

export async function injectCreateModalTemplate() {
  // Get the HTML template
  const result = await fetch("../components/create-modal.tpl"); 
  const text = await result.text(); 
  const template = document.createElement("template"); 
  template.innerHTML = text.trim(); 

  // Append before the JS scripts
  const scripts = document.querySelectorAll("script"); 
  const firstScript = scripts[0]; 
  document.body.insertBefore(template.content.firstElementChild, firstScript); 
}

export function setupModalListeners() {
  /**
   * @brief Sets any modal event listeners up that require ALL DOM content to be loaded 
   * @return none (void)
   */

  // Create button
  const createNoteButton = document.getElementById("create-note-button"); 
  if (createNoteButton) {
    createNoteButton.addEventListener("click", () => {
      loadModal("create", {}); 
    }); 
  } 

  // Note modal 
  const noteModalBackdrop = document.getElementById("note-modal-backdrop"); 
  if (noteModalBackdrop) {
    noteModalBackdrop.addEventListener("click", () => {
      closeModal(noteModalBackdrop); 
    }); 
  }

  const noteModalWindow = document.getElementById("note-modal-window"); 
  if (noteModalWindow) {
    noteModalWindow.addEventListener("click", (event) => {
      event.stopPropagation(); 
    }); 
  }
}

export function loadModal(type, options = {}) {
  /**
   * @brief Loads the specified modal window 
   * @param type The specific modal window 
    * type = {"create", "edit"}
    * "create" is global, "edit" is specific to Notes Manager page 
   * @param options Any associated input/information needed to load the modal
   * @return nothing (void)
   */

  // Populate options 
  const {
    noteId = null
  } = options; 

  // Populate the modal template based on type
  if (type === "create") openCreateModal();
  else if (type === "edit") openEditModal(noteId);    
}

function closeModal(modalBackdrop) {
  /**
   * @brief Exits the current modal window (regardless of what it is)
   * @param modalBackdrop The backdrop to hide upon closing
   * @return nothing (void)
   */

  // Exit the edit modal 
  modalBackdrop.classList.add("hidden"); 
  window.App.render(window.currentPage); 
}

// CREATE MODAL
function openCreateModal() {
  /**
   * @brief Opens the Edit a Note modal 
   * @note Helper for loadModal()
   * @return nothing (void)
   */

  // Populate model template
  const modalBackdrop = document.getElementById("modal-backdrop"); 
  modalBackdrop.classList.remove("hidden"); 

  // Perform button cloning to prevent event listener stacking 
  const oldExitButton = document.getElementById("exit-button-id"); // Get the old button 
  const newExitButton = oldExitButton.cloneNode(true); // Clone the old button to get rid of its event listeners
  oldExitButton.replaceWith(newExitButton); // Replace the old button to prevent duplicates
  newExitButton.addEventListener("click", () => { // Add event listener to new button
    closeModal(modalBackdrop); 
  }); 

  const modalBody = document.getElementById("modal-body"); 
  modalBody.value = ""; 

  const modalTitle = document.getElementById("modal-title");
  modalTitle.innerHTML = "Create a Note"; 

  const oldSaveButton = document.getElementById("save-button-id");
  const newSaveButton = oldSaveButton.cloneNode(true); 
  oldSaveButton.replaceWith(newSaveButton); 
  newSaveButton.addEventListener("click", () => {
    saveNote(modalBody.value, modalBackdrop); 
  }); 
}

function saveNote(noteContent, modalBackdrop) {
  /**
   * @brief Saves the newly created note
   * @note Helper for openCreateModal()
   * @param noteContent The note's content to save 
   * @param modalBackdrop The modal backdrop to hide upon saving
   * @return nothing (void)
   */

  // TODO: Implement
  // If the user hasn't written anything, warn them 
  if (noteContent === "") {
    console.log("Warning: User hasn't written anything"); 
  }

  // Save the note 
  const randomId = crypto.randomUUID(); 
  const now = Date.now(); 
  window.App.notesById[randomId] = {"content": noteContent, "createdAt": now, "wasUpdated": false, "updatedAt": null, "lastChangeAt": now, "isDeleted": false, "deletedAt": null, "pinned": false}; 
  window.App.notesByOrder.unshift(randomId); 
  localStorage.setItem("notesById", JSON.stringify(window.App.notesById)); 
  localStorage.setItem("notesByOrder", JSON.stringify(window.App.notesByOrder)); 
    
  // Close the create modal
  closeModal(modalBackdrop); 
}

// EDIT MODAL
function openEditModal(noteId) {
  /**
   * @brief Opens the Create a Note modal 
   * @note Helper for loadModal()
   * @param noteId The unique id of the note to edit
   * @return nothing (void)
   */

  // Populate modal template 
  const modalBackdrop = document.getElementById("modal-backdrop"); 
  modalBackdrop.classList.remove("hidden"); 

  const exitButton = document.getElementById("exit-button-id");  
  exitButton.addEventListener("click", () => {
    closeModal(modalBackdrop); 
  }); 

  const modalTitle = document.getElementById("modal-title");
  modalTitle.innerHTML = "Edit a Note"; 

  const modalBody = document.getElementById("modal-body"); 
  modalBody.value = window.App.notesById[noteId].content;   

  const saveButton = document.getElementById("save-button-id"); 
  saveButton.addEventListener("click", () => {
    saveEdit(noteId, modalBackdrop, modalBody.value); 
  }); 
}

function saveEdit(noteId, modalBackdrop, newContent) {
  /**
   * @brief Saves the edited note
   * @note Helper for editNote()
   * @param noteId The unique id of the edited note to save
   * @param modalBackdrop The modal object to hide after saving
   * @param newContent The new, edited string to be used as the note's content
   * @return nothing (void)
   */
  
  // If the content hasn't changed, warn the user 
  // TODO: Implement this 
  if (newContent === window.App.notesById[noteId].content) {
    console.log("The content is the same!"); 
  }

  // Save the edited note 
  const now = Date.now(); 

  const editedNote = window.App.notesById[noteId]; 
  editedNote.content = newContent; 
  editedNote.wasUpdated = true; 
  editedNote.updatedAt = now; 
  editedNote.lastChangeAt = now; 
  localStorage.setItem("notesById", JSON.stringify(window.App.notesById)); 

  window.App.notesByOrder.splice(window.App.notesByOrder.indexOf(noteId), 1); 
  window.App.notesByOrder.unshift(noteId); 
  localStorage.setItem("notesByOrder", JSON.stringify(window.App.notesByOrder));

  // Close the edit modal
  closeModal(modalBackdrop);  
}

// NOTE MODAL
export function openNoteModal(id) {
  /**
   * @brief Opens the Note Modal for a specific note
   * @param id The id of the note to open
   * @return nothing (void)
   */

  // Show modal backdrop
  const modalBackdrop = document.getElementById("note-modal-backdrop"); 
  modalBackdrop.classList.remove("hidden"); 

  // Populate note modal template
  const timestamp = document.getElementById("note-modal-timestamp"); 
  if (window.App.notesById[id].wasUpdated) timestamp.textContent = "Edited " + window.App.convertTimestamp(window.App.notesById[id].updatedAt); 
  else timestamp.textContent = "Created " + window.App.convertTimestamp(window.App.notesById[id].createdAt);
  
  const pinStatus = document.getElementById("pin-status"); 
  if (!window.App.notesById[id].pinned) { // If not pinned, don't show the pin icon
    pinStatus.classList.add("hidden"); 
  } else pinStatus.classList.remove("hidden"); // Otherwise show it 

  const content = document.getElementById("note-modal-body"); 
  content.textContent = window.App.notesById[id].content; 

  const bottomRow = document.getElementById("note-bottom-row")
  bottomRow.innerHTML = ""; // Clear bottom row upon each re-generation of buttons
  
  if (!window.App.notesById[id].isDeleted) { // If an active note
    const pinButton = document.createElement("button"); 
    pinButton.className = "button-icon"; 
    const pinSVG = window.App.createSVG("pin-button"); 
    pinButton.append(pinSVG); 
    pinButton.addEventListener("click", () => {
      togglePin(id); 
    }); 
    bottomRow.append(pinButton);

    const deleteButton = document.createElement("button"); 
    deleteButton.className = "button-icon"; 
    const deleteSVG = window.App.createSVG("delete"); 
    deleteButton.append(deleteSVG); 
    deleteButton.addEventListener("click", () => {
      deleteNote(id); 
    }); 
    bottomRow.append(deleteButton);

    const editButton = document.createElement("button"); 
    editButton.className = "button-icon"; 
    const editSVG = window.App.createSVG("edit"); 
    editButton.append(editSVG); 
    editButton.addEventListener("click", () => {
      loadModal("edit", {noteId: id});  
    }); 
    bottomRow.append(editButton);
        
  } else { // Otherwise if a deleted note
      const recoverButton = document.createElement("button"); 
      recoverButton.className = "button-icon"; 
      const recoverSVG = window.App.createSVG("recover"); 
      recoverButton.append(recoverSVG);  
      recoverButton.addEventListener("click", () => {
        recoverNote(id); 
      }); 
      bottomRow.append(recoverButton);
    }

}

function togglePin(id) {
  /** 
   * @brief Toggles the pin on the specified note
   * @param id The unique id of the relative note
   * @return nothing (void)
   */
  
  // If toggling pin on 
  if (!window.App.notesById[id].pinned) {
    window.App.notesById[id].pinned = true; 
    window.App.notesPinnedByOrder.unshift(id);
  } else { // Otherwise if toggling pin off
    window.App.notesById[id].pinned = false; 
    window.App.notesPinnedByOrder.splice(window.App.notesPinnedByOrder.indexOf(id), 1); 
  }

  // Set local storage 
  localStorage.setItem("notesById", JSON.stringify(window.App.notesById)); 
  localStorage.setItem("notesPinnedByOrder", JSON.stringify(window.App.notesPinnedByOrder)); 
  
  window.App.render(window.currentPage); 
}

function deleteNote(id) {
  /**
   * @brief Deletes the specified note 
   * @param id The unique id of the note to delete 
   * @return nothing (void)
   */

  const cardToDelete = document.getElementById(`note-${id}`);
  if (cardToDelete) { // Safe-check to make sure we got a valid element
    window.App.notesById[id].isDeleted = true; 
    window.App.notesById[id].deletedAt = Date.now(); 
    window.App.notesById[id].pinned = false;     
    localStorage.setItem("notesById", JSON.stringify(window.App.notesById)); 

    window.App.notesByOrder.splice(window.App.notesByOrder.indexOf(id), 1);
    localStorage.setItem("notesByOrder", JSON.stringify(window.App.notesByOrder)); 

    window.App.notesPinnedByOrder.splice(window.App.notesPinnedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesPinnedByOrder", JSON.stringify(window.App.notesPinnedByOrder)); 

    window.App.notesDeletedByOrder.unshift(id);               
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(window.App.notesDeletedByOrder)); 

    cardToDelete.remove();                               
  }
}

function recoverNote(id) {
  /**
   * @brief Recovers a deleted note 
   * @note Helper for createNoteCardElement()
   * @param id The unique id of the note to recover
   * @return nothing (void)
   */

  const cardToRecover = document.getElementById(`note-${id}`); 
  if (cardToRecover) {
    window.App.notesById[id].isDeleted = false; 
    window.App.notesById[id].deletedAt = null; 
    localStorage.setItem("notesById", JSON.stringify(window.App.notesById));

    window.App.notesByOrder.splice(findInsertIndex(id), 0, id); 
    localStorage.setItem("notesByOrder", JSON.stringify(window.App.notesByOrder)); 

    window.App.notesDeletedByOrder.splice(window.App.notesDeletedByOrder.indexOf(id), 1); 
    localStorage.setItem("notesDeletedByOrder", JSON.stringify(window.App.notesDeletedByOrder)); 
    
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
  if (window.App.notesByOrder.length === 0) return 0; 

  // Get note to recover's timestamp 
  const noteToRecover = window.App.notesById[id]; 
  const noteToRecoverTimestamp = noteToRecover.lastChangeAt; 

  // Use binary search to find index 
  /** @note Remember that notesByOrder is by timestamp DESCENDING! */
  let lo = 0; 
  let hi = window.App.notesByOrder.length - 1; 
  while (lo < hi) {
    // Get middle object's timestamp 
    let mid = Math.floor(lo + (hi - lo) / 2); 
    let midNote = window.App.notesById[window.App.notesByOrder[mid]];
    let midTimestamp = midNote.lastChangeAt; 

    // If mid is less than our timestamp, adjust window left 
    if (midTimestamp <= noteToRecoverTimestamp) hi = mid; 

    // Otherwise, adjust window right 
    else lo = mid + 1; 
  }

  // arr[lo] is the first element <= ourTimestamp
  if (window.App.notesById[window.App.notesByOrder[lo]].lastChangeAt > noteToRecoverTimestamp) return lo + 1; 
  else return lo;  
}