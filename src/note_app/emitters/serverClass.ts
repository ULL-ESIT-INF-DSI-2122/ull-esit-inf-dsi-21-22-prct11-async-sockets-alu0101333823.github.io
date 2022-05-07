import * as net from 'net';
import {User} from '../notes/user';

/**
 * Server class, brings the correct solution to the Client request
 */
export class Server { 
  private server;
  /**
   * Constructor
   * @param connection socket that will allow the conection
   */  
  constructor(private port: number) {
    const server = net.createServer((connection) => {
      console.log('Connection established!');
      let strMsg: string = '';

      connection.on('close', () => {
        console.log('User disconnected!');
      });

      connection.on('data', (msg) => {
        console.log(`Message recieved!`);
        strMsg += msg;
        const command = JSON.parse(strMsg);
        const user = new User(command.user);
    
        switch (command.cmd) {
          case 'add':
            const response1: string = user.addNote(command.noteTitle, command.body, command.color);
            connection.write(response1, () => {
              connection.end();
            });
            break;
          case 'mod':
            const response2: string = user.modifyNote(command.noteTitle, command.newTitle, command.body, command.color);
            connection.write(response2, () => {
              connection.end();
            });
            break;
          case 'list':
            const response3: string = user.listNotes();
            connection.write(response3, () => {
              connection.end();
            });
            break;
          case 'del':
            const response4: string = user.removeNote(command.noteTitle);   
            connection.write(response4, () => {
              connection.end();
            });     
            break;
          case 'read':
            const response5: string = user.readNote(command.noteTitle);
            connection.write(response5, () => {
              connection.end();
            });
            break;
          default:
            console.log('Wrong command introduced...');
            connection.write('Wrong command introduced...', () => {
              connection.end();
            });
        }
        console.log(`Response sent!`);
      });
    });
    this.server = server;
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log('Waiting user...');
    });
  }
}
