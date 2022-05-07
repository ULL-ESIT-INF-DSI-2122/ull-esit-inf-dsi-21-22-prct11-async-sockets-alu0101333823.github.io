import yargs = require('yargs');
import {commandType} from './commandType';
import {Client} from './emitters/clientClass';
import * as net from 'net';

if (process.argv.length > 3) {
  const conection = net.connect({port: 60300});
  const client = new Client(conection);
  client.on('response', (response) => {
    console.log(`Comando recibido con éxito:\n${response}`);
  });

  /**
   * Add command. Allows to create a new note for a user
   */
  yargs.command( {
    command: 'add',
    describe: 'Adds a new note',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Note body',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Note color',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
        typeof argv.body === 'string' && typeof argv.color === 'string') {
        const command: commandType = {
          cmd: 'add',
          user: argv.user,
          noteTitle: argv.title,
          body: argv.body,
          color: argv.color,
        };
        conection.write(`${JSON.stringify(command)}`, (err) => {
          if (err) {
            console.log(`Something wrong while executing '${command.cmd}' command`);
          }
        });
      } 
    },
  });

  /**
   * Modify command. Allows to modify a existing note from a user
   */
  yargs.command( {
    command: 'mod',
    describe: 'Modifies a note, let param "" for not change it',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
      newTitle: {
        describe: 'New note title',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Note body',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Note color',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string' && 
          typeof argv.newTitle === 'string' && typeof argv.body === 'string' && 
          typeof argv.color === 'string') {
        const command: commandType = {
          cmd: 'mod',
          user: argv.user,
          noteTitle: argv.title,
          newTitle: argv.newTitle,
          body: argv.body,
          color: argv.color,
        };
        conection.write(`${JSON.stringify(command)}`, (err) => {
          if (err) {
            console.log(`Something wrong while executing '${command.cmd}' command`);
          }
        });  
      } 
    },
  });

  /**
   * Remove command. Deletes an existing note from a user
   */
  yargs.command( {
    command: 'del',
    describe: 'Removes a note',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string') {
        const command: commandType = {
          cmd: 'del',
          user: argv.user,
          noteTitle: argv.title,
        };
        conection.write(`${JSON.stringify(command)}`, (err) => {
          if (err) {
            console.log(`Something wrong while executing '${command.cmd}' command`);
          }
        });
      }
    },
  });

  /**
   * List command. List all the notes from a user
   */
  yargs.command( {
    command: 'list',
    describe: 'List notes from a user',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string') {
        const command: commandType = {
          cmd: 'list',
          user: argv.user,
        };
        conection.write(`${JSON.stringify(command)}`, (err) => {
          if (err) {
            console.log(`Something wrong while executing '${command.cmd}' command`);
          }
        });
      }
    },
  });

  /**
   * Read command. Read a note from a user
   */
  yargs.command( {
    command: 'read',
    describe: 'Read a note',
    builder: {
      user: {
        describe: 'User',
        demandOption: true,
        type: 'string',
      },
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === 'string' && typeof argv.title === 'string') {
        const command: commandType = {
          cmd: 'read',
          user: argv.user,
          noteTitle: argv.title,
        };
        conection.write(`${JSON.stringify(command)}`, (err) => {
          if (err) {
            console.log(`Something wrong while executing '${command.cmd}' command`);
          }
        });
      }
    },
  });

  yargs.parse();
} else {
  console.log('No command was specified');
}

