export default class NoteAPI {
  static getAllNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes-app")) || [];
    return savedNotes.sort((a, b) => (a.updated > b.updated ? -1 : 1));
  }

  static saveNote(noteToSave) {
    const notes = NoteAPI.getAllNotes();
    const existedNote = notes.find((n) => n.id == noteToSave.id);

    if (existedNote) {
      existedNote.title = noteToSave.title;
      existedNote.text = noteToSave.text;
      existedNote.updated = new Date().toISOString();
    } else {
      noteToSave.id = new Date().getTime();
      noteToSave.updated = new Date().toISOString();
      notes.push(noteToSave);
    }

    localStorage.setItem("notes-app", JSON.stringify(notes));
  }

  static removeNote(id) {
    const notes = NoteAPI.getAllNotes();
    const filteredNotes = notes.filter((n) => n.id != id);
    localStorage.setItem("notes-app", JSON.stringify(filteredNotes));
  }
}
