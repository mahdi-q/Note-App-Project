import NoteAPI from "./NoteAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());
    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NoteAPI.getAllNotes();

    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNotesList(notes);
    this.view.updateNoteSectionVisibility(notes.length > 0);
  }

  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers() {
    return {
      onNoteAdd: () => {
        const newNote = {
          title: "Note Title",
          text: "Note Text ...",
        };

        NoteAPI.saveNote(newNote);
        this._refreshNotes();
      },

      onNoteEdite: (newTitle, newText) => {
        const editedNote = {
          id: this.activeNote.id,
          title: newTitle,
          text: newText,
        };

        NoteAPI.saveNote(editedNote);
        this._refreshNotes();
      },

      onNoteSelect: (noteId) => {
        const selectedNote = this.notes.find(
          (note) => note.id === parseInt(noteId)
        );
        this._setActiveNote(selectedNote);
      },

      onNoteRemove: (noteId) => {
        NoteAPI.removeNote(noteId);
        this._refreshNotes();
      },
    };
  }
}
