// Constants & Variables 
const notesById = JSON.parse(localStorage.getItem("notesById")) || {}; // Single truth source 
/**
 * notesById = {
 *  "uniqueId1": {
 *    "content": string
 *    "createdAt": int (epoch)
 *    "wasUpdated": boolean
 *    "updatedAt": int (epoch) || null if not updated 
 *    "isDeleted": boolean
 *    "deletedAt": int (epoch) || null if not deleted
 *   }
 *   ...
 * }
 */

const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of note ID's descending by timestamp created/edited
// notesByOrder = ["uniqueId20", "uniqueId19", "uniqueId18", ...]

const notesDeletedByOrder = JSON.parse(localStorage.getItem("notesDeletedByOrder")) || []; // Array of deleted note ID's descending by timestamp deleted
// notesDeletedByOrder = ["uniqueId200", "uniqueId199", "uniqueId198", ...]

// Event Listeners 


// Functions 
function convertTimestamp(epochMS) {
  /**
   * @brief: Converts time since epoch in MS to a formatted date string to be shown on a note card 
   * @note: formatted as month/day/full_year, x:xx:xx AM/PM
   * @param epochMS: time since epoch in MS 
   * @return: the formatted string 
   */

  const epochDate = new Date(epochMS); 
  return epochDate.toLocaleString("en-US"); 
}