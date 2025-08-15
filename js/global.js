// Constants & Variables 
const notesById = JSON.parse(localStorage.getItem("notesById")) || {}; // Object of note objects
// notesById = {"uniqueId1":{"content":contentHere, "timestamp":timestampHere}, ...}
const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of note ID's descending by timestamp created
// notesByOrder = ["uniqueId20", "uniqueId19", "uniqueId18", ...]
const notesDeletedByOrder = JSON.parse(localStorage.getItem("notesDeletedByOrder")); // Array of deleted note ID's descending by timestamp deleted

// Event Listeners 


// Functions 
