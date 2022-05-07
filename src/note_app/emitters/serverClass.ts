import {EventEmitter} from 'events';

/**
 * Server class, brings the correct solution to the Client request
 */
export class Server extends EventEmitter { 
  /**
   * Constructor
   * @param connection socket that will allow the conection
   */  
  constructor(connection: EventEmitter) {
    super();

    let allData = '';
    connection.on('data', (dataChunk) => {
      allData += dataChunk;

      let messageLimit = allData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = allData.substring(0, messageLimit);
        allData = allData.substring(messageLimit + 1);
        this.emit('request', JSON.parse(message));
        messageLimit = allData.indexOf('\n');
      }
    });
  }
}
