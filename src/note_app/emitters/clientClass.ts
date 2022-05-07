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

    let mensajeTexto = '';
    connection.on('data', (parteMensaje) => {
      mensajeTexto += parteMensaje.toString();
    });

    connection.on('end', () => {
      this.emit('response', mensajeTexto);
    });
  }
}
