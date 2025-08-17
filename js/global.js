// Constants & Variables 
const notesById = JSON.parse(localStorage.getItem("notesById")) || {}; // Object of note objects
// notesById = {"uniqueId1":{"content":contentHere, "timestampCreated":timestampHere}, "deleted": false/true, "timestampDeleted"...}
const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of note ID's descending by timestamp created
// notesByOrder = ["uniqueId20", "uniqueId19", "uniqueId18", ...]
const notesDeletedByOrder = JSON.parse(localStorage.getItem("notesDeletedByOrder")); // Array of deleted note ID's descending by timestamp deleted
// notesDeletedByOrder = ["uniqueId200", "uniqueId199", "uniqueId198", ...]

// Event Listeners 


// Functions 
