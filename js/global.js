// Constants & Variables 
const notesById = JSON.parse(localStorage.getItem("notesById")) || {}; // Object of note objects
// notesById = {"uniqueId1":{"content":contentHere, "timestamp":timestampHere}, ...}
const notesByOrder = JSON.parse(localStorage.getItem("notesByOrder")) || []; // Array of notes in descending order
// notesByOrder = ["uniqueId20", "uniqueId19", "uniqueId18", ...]

// Event Listeners 


// Functions 
