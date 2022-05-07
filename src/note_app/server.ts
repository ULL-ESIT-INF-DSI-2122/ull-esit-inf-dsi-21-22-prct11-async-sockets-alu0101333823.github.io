// import {User} from './notes/user';
import {commandType} from './commandType';
// import {Server} from './emitters/serverClass';
import * as net from 'net';

const myServer = net.createServer((connection) => {
  console.log('Connection established!');
  // const server = new Server(connection);
  connection.on('request', (command: commandType) => {
    connection.write(`${JSON.stringify(command.cmd)}`, () => {
      console.log('Mensaje enviado');
      connection.end();
    });
  });
});

myServer.listen(60300, () => {
  console.log('Waiting user...');
});