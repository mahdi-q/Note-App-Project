export default class NotesView {
  constructor(root, handlers) {
    this.root = root;

    const { onNoteAdd, onNoteEdite, onNoteSelect, onNoteRemove } = handlers;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdite = onNoteEdite;
    this.onNoteSelect = onNoteSelect;
    this.onNoteRemove = onNoteRemove;

    this.root.innerHTML = `
      <section class="note">
        <input
          class="note__title"
          type="text"
          placeholder="Write your title ..."
        />
        <textarea
          class="note__text"
          cols="30"
          rows="17"
          placeholder="Write your note here ..."
        ></textarea>
      </section>

      <section class="sidebar">
        <h1 class="sidebar__title">NOTE APP</h1>
        <ul class="sidebar__notes"></ul>
        <button class="sidebar__btn">Add Note</button>
      </section>
    `;

    const addNoteBtn = this.root.querySelector(".sidebar__btn");
    const titleInput = this.root.querySelector(".note__title");
    const textInput = this.root.querySelector(".note__text");

    addNoteBtn.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [titleInput, textInput].forEach((inputField) => {
      inputField.addEventListener("change", () => {
        const newTitle = titleInput.value.trim();
        const newText = textInput.value.trim();
        this.onNoteEdite(newTitle, newText);
      });
    });
  }

  _creatNoteListHTML(id, title, text, updated) {
    const MAX_TEXT_LENGTH = 50;
    return `
        <li class="sidebar__note" data-note-id=${id}>
            <div class="note-header">
              <i class="note-icon fa-regular fa-trash-can" data-note-id=${id}></i>
              <h2 class="note-title">
               ${title.substring(0, 10)}
               ${title.length > 10 ? "..." : ""}
              </h2>
            </div>
            <div class="note-description">
             ${text.substring(0, MAX_TEXT_LENGTH)}
             ${text.length > MAX_TEXT_LENGTH ? "..." : ""}
            </div>
            <div class="note-date">
              <div>${new Date(updated).toLocaleDateString("en", {
                dateStyle: "full",
              })}</div>
              <div>At ${new Date(updated).toLocaleTimeString("en", {
                timeStyle: "short",
              })}</div>
            </div>
        </li>
        `;
  }

  updateNotesList(notes) {
    const slidebarNotes = this.root.querySelector(".sidebar__notes");

    slidebarNotes.innerHTML = "";

    let noteList = "";
    for (const note of notes) {
      const { id, title, text, updated } = note;
      const html = this._creatNoteListHTML(id, title, text, updated);
      noteList += html;
    }

    slidebarNotes.innerHTML = noteList;

    slidebarNotes
      .querySelectorAll(".sidebar__note")
      .forEach((note) =>
        note.addEventListener("click", () =>
          this.onNoteSelect(note.dataset.noteId)
        )
      );

    slidebarNotes.querySelectorAll(".note-icon").forEach((note) =>
      note.addEventListener("click", (event) => {
        event.stopPropagation();
        this.onNoteRemove(note.dataset.noteId);
      })
    );
  }

  updateActiveNote(note) {
    this.root.querySelector(".note__title").value = note.title;
    this.root.querySelector(".note__text").value = note.text;

    this.root
      .querySelectorAll(".sidebar__note")
      .forEach((item) => item.classList.remove("selected"));

    this.root
      .querySelector(`.sidebar__note[data-note-id="${note.id}"]`)
      .classList.add("selected");
  }

  updateNoteSectionVisibility(visibility) {
    this.root.querySelector(".note").style.visibility = visibility
      ? "visible"
      : "hidden";
  }
}
