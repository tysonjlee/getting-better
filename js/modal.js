// Functions 
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
  window.render(window.currentPage); 
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
  window.notesById[randomId] = {"content": noteContent, "createdAt": now, "wasUpdated": false, "updatedAt": null, "lastChangeAt": now, "isDeleted": false, "deletedAt": null, "pinned": false}; 
  window.notesByOrder.unshift(randomId); 
  localStorage.setItem("notesById", JSON.stringify(window.notesById)); 
  localStorage.setItem("notesByOrder", JSON.stringify(window.notesByOrder)); 
    
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
  modalBody.value = window.notesById[noteId].content;   

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
  if (newContent === window.notesById[noteId].content) {
    console.log("The content is the same!"); 
  }

  // Save the edited note 
  const now = Date.now(); 

  const editedNote = window.notesById[noteId]; 
  editedNote.content = newContent; 
  editedNote.wasUpdated = true; 
  editedNote.updatedAt = now; 
  editedNote.lastChangeAt = now; 
  localStorage.setItem("notesById", JSON.stringify(window.notesById)); 

  window.notesByOrder.splice(window.notesByOrder.indexOf(noteId), 1); 
  window.notesByOrder.unshift(noteId); 
  localStorage.setItem("notesByOrder", JSON.stringify(window.notesByOrder));

  // Close the edit modal
  closeModal(modalBackdrop);  
}

// NOTE MODAL
function openNoteModal() {
  /**
   * @brief Opens the Note Modal
   * @return nothing (void)
   */

  // Show modal backdrop
  const modalBackdrop = document.getElementById("modal-backdrop"); 
  modalBackdrop.classList.remove("hidden"); 

  // Add event listener to close modal on outside click


  // Populate note modal template


}