import {EventEmitter} from 'events';

/**
 * Client class, allows to correctly connects to server
 */
export class Client extends EventEmitter {
  /**
   * Constructor
   * @param connection socket that will allow the conection
   */  
  constructor(connection: EventEmitter) {
    super();

    let allData = '';
    connection.on('data', (dataChunk) => {
      allData += dataChunk.toString();
    });
    this.emit('request', JSON.parse(allData));

    connection.on('end', () => {
      console.log('Conexión terminada');
    });
  }
}
