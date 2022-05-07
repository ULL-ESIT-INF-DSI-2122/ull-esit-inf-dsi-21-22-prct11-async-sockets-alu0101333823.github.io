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
    if (fs.existsSync(`src/ejercicio-3/usersFolder/${this.userName}`)) {
      const userFiles = fs.readdirSync(`src/ejercicio-3/usersFolder/${this.userName}/`);      
      userFiles.forEach((file) => {
        const jsonObject = JSON.parse(fs.readFileSync(`src/ejercicio-3/usersFolder/${this.userName}/${file}`).toString());
        const newNote = new Note(jsonObject.title, jsonObject.body, jsonObject.colour);
        this.notes.push(newNote);
      });      
    } else {
      fs.mkdirSync(`src/ejercicio-3/usersFolder/${this.userName}`);
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
  public modifyNote(title: string, newTitle: string, body: string, colour: string) {
    if (fs.existsSync(`src/ejercicio-3/usersFolder/${this.userName}/${title}.json`)) {
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
    } else {
      console.log(chalk.red("Fichero no encontrado"));
    }
  }

  /**
   * Add's a new note for a user
   * @param title of the note
   * @param body of the note
   * @param colour of the note
   */
  public addNote(title: string, body: string, colour: string) {
    if (!fs.existsSync(`src/ejercicio-3/usersFolder/${this.userName}/${title}.json`)) {
      const note = new Note(title, body, colour);
      this.notes.push(note);
      fs.writeFile(`src/ejercicio-3/usersFolder/${this.userName}/${title}.json`, 
          `{\n\t"title": "${title}",
          \n\t"body": "${body}",
          \n\t"colour": "${colour}"\n}`, 
          () => {
            console.log(chalk.green('La nota ha sido añadida correctamente'));
          });
    } else {
      console.log(chalk.red('El fichero ya existe actualmente'));
    }
  }

  /**
   * Remove's a note from it's title
   * @param title of the note to be removed
   */
  public removeNote(title: string) {
    if (!fs.existsSync(`src/ejercicio-3/usersFolder/${this.userName}/${title}.json`)) {
      console.log(chalk.red('El fichero no existe'));
    } else {
      this.notes.forEach((note, i) => {
        if (note.getTitle() === title ) {
          this.notes.splice(i, 1); 
        }
      });
      fs.rm(`src/ejercicio-3/usersFolder/${this.userName}/${title}.json`, () => {
        console.log(chalk.green(`El fichero ${title} ha sido eliminado satisfactoriamente!`));
      });
    }
  }

  /**
   * List all the notes of the user
   */
  public listNotes() {
    this.notes.forEach((note, index) => {
      const color = note.getColour();
      switch (color) {
        case "magenta":
          console.log(chalk.magenta(`${index + 1}) ${note.getTitle()}`));
          break;        
        case "blue":
          console.log(chalk.blue(`${index + 1}) ${note.getTitle()}`));
          break;
        case "white":
          console.log(chalk.white(`${index + 1}) ${note.getTitle()}`));
          break;
        case "cyan":
          console.log(chalk.cyan(`${index + 1}) ${note.getTitle()}`));
          break;
        case "yellow": 
          console.log(chalk.yellow(`${index + 1}) ${note.getTitle()}`));
          break;
        default:
          console.log(chalk.red(`Ningún color válido en la nota ${note.getTitle()}, bórrela`));
          break;
      }
    });
  }

  /**
   * Opens and reads all the content of a note
   * @param title of the note to read
   */
  public readNote(title: string) {
    if (!fs.existsSync(`src/ejercicio-3/usersFolder/${this.userName}/${title}.json`)) {
      console.log(chalk.red('El fichero no existe'));
    } else {
      this.notes.forEach((note) => {
        if (note.getTitle() === title) {
          switch (note.getColour()) {
            case "magenta":
              console.log(chalk.magenta(`${note.getTitle()}: `));
              console.log(chalk.magenta(`\t${note.getBody()}`));
              break;        
            case "blue":
              console.log(chalk.blue(`${note.getTitle()}: `));
              console.log(chalk.blue(`\t${note.getBody()}`));
              break;
            case "white":
              console.log(chalk.white(`${note.getTitle()}: `));
              console.log(chalk.white(`\t${note.getBody()}`));
              break;
            case "cyan":
              console.log(chalk.cyan(`${note.getTitle()}: `));
              console.log(chalk.cyan(`\t${note.getBody()}`));
              break;
            case "yellow": 
              console.log(chalk.yellow(`${note.getTitle()}: `));
              console.log(chalk.yellow(`\t${note.getBody()}`));
              break;
            default:
              console.log(chalk.red(`Ningún color válido en la nota ${note.getTitle()}, bórrela`));
              break;
          }
        }
      });
    }
  }
}
