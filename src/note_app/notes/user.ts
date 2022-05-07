import { Note } from "./note";
import * as chalk from 'chalk';
import * as fs from "fs";

/**
 * User class. Can manages notes
 */
export class User {
  private notes: Note[] = [];

  /**
   * Constructor. Creates a user by it's name and stores all of the current existing 
   * files for the user.
   * @param userName Name of the user
   */
  constructor(private userName: string) {    
    if (fs.existsSync(`src/note_app/notes/usersFolder/${this.userName}`)) {
      const userFiles = fs.readdirSync(`src/note_app/notes/usersFolder/${this.userName}/`);      
      userFiles.forEach((file) => {
        const jsonObject = JSON.parse(fs.readFileSync(`src/note_app/notes/usersFolder/${this.userName}/${file}`).toString());
        const newNote = new Note(jsonObject.title, jsonObject.body, jsonObject.colour);
        this.notes.push(newNote);
      });      
    } else {
      fs.mkdirSync(`src/note_app/notes/usersFolder/${this.userName}`);
    }
  }

  /**
   * @returns the user name
   */
  public getUserName() {
    return this.userName;
  }

  /**
   * Modifies a Note
   * @param title of the note 
   * @param body of the note
   * @param colour of the note
   */
  public modifyNote(title: string, newTitle: string, body: string, colour: string): string {
    let str: string = '';
    if (fs.existsSync(`src/note_app/notes/usersFolder/${this.userName}/${title}.json`)) {
      let index = 0;
      this.notes.forEach((note, i) => {
        if (note.getTitle() === title) {
          index = i;
        }
      });
      const note = this.notes[index];

      if (newTitle !== "") {
        note.setTitle(newTitle);
      }
      if (body !== "") {
        note.setBody(body);
      }
      if (colour !== "") {
        note.setColour(colour);
      }
      this.removeNote(title);
      this.addNote(note.getTitle(), note.getBody(), note.getColour());
      str = chalk.green("Fichero modificado!");
    } else {
      str = chalk.red("Fichero no encontrado");
    }
    return str;
  }

  /**
   * Add's a new note for a user
   * @param title of the note
   * @param body of the note
   * @param colour of the note
   */
  public addNote(title: string, body: string, colour: string): string {
    let str: string = '';
    if (!fs.existsSync(`src/note_app/notes/usersFolder/${this.userName}/${title}.json`)) {
      const note = new Note(title, body, colour);
      this.notes.push(note);
      fs.writeFile(`src/note_app/notes/usersFolder/${this.userName}/${title}.json`, 
          `{\n\t"title": "${title}",
          \n\t"body": "${body}",
          \n\t"colour": "${colour}"\n}`, 
          () => {
          });
      str = chalk.green('La nota ha sido añadida correctamente');
    } else {
      str = chalk.red('El fichero ya existe actualmente');
    }
    return str;
  }

  /**
   * Remove's a note from it's title
   * @param title of the note to be removed
   */
  public removeNote(title: string) {
    let str: string = '';
    if (!fs.existsSync(`src/note_app/notes/usersFolder/${this.userName}/${title}.json`)) {
      str = chalk.red('El fichero no existe');
    } else {
      this.notes.forEach((note, i) => {
        if (note.getTitle() === title ) {
          this.notes.splice(i, 1); 
        }
      });
      fs.rm(`src/note_app/notes/usersFolder/${this.userName}/${title}.json`, () => {
      });
      str = chalk.green(`El fichero ${title} ha sido eliminado satisfactoriamente!`);
    }
    return str;
  }

  /**
   * List all the notes of the user
   */
  public listNotes(): string {
    let str = '';
    this.notes.forEach((note, index) => {
      const color = note.getColour();
      switch (color) {
        case "magenta":
          str += chalk.magenta(`${index + 1}) ${note.getTitle()}\n`);
          break;        
        case "blue":
          str += chalk.blue(`${index + 1}) ${note.getTitle()}\n`);
          break;
        case "white":
          str += chalk.white(`${index + 1}) ${note.getTitle()}\n`);
          break;
        case "cyan":
          str += chalk.cyan(`${index + 1}) ${note.getTitle()}\n`);
          break;
        case "yellow": 
          str += chalk.yellow(`${index + 1}) ${note.getTitle()}\n`);
          break;
        default:
          str = chalk.red(`Ningún color válido en la nota ${note.getTitle()}, bórrela`);
          break;
      }
    });
    return str;
  }

  /**
   * Opens and reads all the content of a note
   * @param title of the note to read
   */
  public readNote(title: string) {
    let str = '';
    if (!fs.existsSync(`src/note_app/notes/usersFolder/${this.userName}/${title}.json`)) {
      str = chalk.red('El fichero no existe');
    } else {
      this.notes.forEach((note) => {
        if (note.getTitle() === title) {
          switch (note.getColour()) {
            case "magenta":
              str += chalk.magenta(`${note.getTitle()}: \n`);
              str += chalk.magenta(`\t${note.getBody()}`);
              break;        
            case "blue":
              str += chalk.blue(`${note.getTitle()}: \n`);
              str += chalk.blue(`\t${note.getBody()}`);
              break;
            case "white":
              str += chalk.white(`${note.getTitle()}: \n`);
              str += chalk.white(`\t${note.getBody()}`);
              break;
            case "cyan":
              str += chalk.cyan(`${note.getTitle()}: \n`);
              str += chalk.cyan(`\t${note.getBody()}`);
              break;
            case "yellow": 
              str += chalk.yellow(`${note.getTitle()}: \n`);
              str += chalk.yellow(`\t${note.getBody()}`);
              break;
            default:
              str += chalk.red(`Ningún color válido en la nota ${note.getTitle()}, bórrela`);
              break;
          }
        }
      });
    }
    return str;
  }
}
