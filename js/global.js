/** @note: Make sure each js file imports from this global file! */

// Constants & Variables 
export const notesById = JSON.parse(localStorage.getItem("notesById")) || {}; // Single truth source 
window.notesById = notesById; 
/**
 * notesById = {
 *  "uniqueId1": {
 *    "content": string
 *    "createdAt": int (epoch)
 *    "wasUpdated": boolean
 *    "updatedAt": int (epoch) || null if not updated 
 *    "lastChangeAt": int (epoch) [greatest of createdAt & updatedAt times]
 *    "isDeleted": boolean
 *    "deletedAt": int (epoch) || null if not deleted
 *   }
 *   ...
 * }
 */

export const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of note ID's descending by timestamp created/edited
window.notesByOrder = notesByOrder; 
// notesByOrder = ["uniqueId20", "uniqueId19", "uniqueId18", ...]

export const notesDeletedByOrder = JSON.parse(localStorage.getItem("notesDeletedByOrder")) || []; // Array of deleted note ID's descending by timestamp deleted
window.notesDeletedByOrder = notesDeletedByOrder; 
// notesDeletedByOrder = ["uniqueId200", "uniqueId199", "uniqueId198", ...]

// Event Listeners 

// Functions 
export async function render(page) {
  /**
   * @brief: Renders the specified page 
   * @param page: The specific page to render
   * @return: nothing (void)
   */
  
  if (page === "home"){
    const homeModule = await import("./index.js");
    homeModule.renderHome(); 
  } else if (page === "manager"){
    const managerModule = await import("./manager.js"); 
    managerModule.renderManager(); 
  } else if (page === "deleted") {
    const deletedModule = await import("./deleted.js"); 
    deletedModule.renderDeleted(); 
  }
}
window.render = render; 

export function convertTimestamp(epochMS) {
  /**
   * @brief: Converts time since epoch in MS to a formatted date string to be shown on a note card 
   * @note: formatted as month/day/full_year, x:xx:xx AM/PM
   * @param epochMS: time since epoch in MS 
   * @return: the formatted string 
   */

  const epochDate = new Date(epochMS); 
  return epochDate.toLocaleString("en-US"); 
}
window.convertTimestamp = convertTimestamp; 
