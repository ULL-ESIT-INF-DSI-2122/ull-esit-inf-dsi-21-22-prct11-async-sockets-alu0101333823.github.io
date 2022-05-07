# Práctica 11: Sistema de fichero y creación de procesos en Node JS
## Juan Marrero Domínguez alu0101333823

### Introducción 

En esta undécima práctica crearemos un sistema cliente-servidor para el procesado de notas. Dicho procesado se lleva mediante la aplicación creada anteriormente. Mediante dicha aplicación, manejaremos las peticiones gracias a _yargs_ para gestionar las distintas opciones que la aplicación permite. 

El código de la app de notas es prácticamente el mismo que en su día se desarrolló, por lo que no lo incluiré en el informe. En vez de imprimir por consola los mensajes de _feedback_ se guardarán en `strings` para devolverlos al cliente y que se visualicen ahí.

El funcionamiento es muy sencillo. Se ha desarrollado una clase `Server` y `Client`. Dichas clases contienen la funcionalidad necesaria para manejar las peticiones. En los ficheros `cliente.ts` y `server.ts` se instancian dichas clases y se llevará a cabo la ejecución del código. El servidor se inicializará, a la espera de un usuario que se conecte. Una vez se conecte un usuario, le enviará un comando a modo de petición (un comando de la aplicación de notas). El servidor la procesará, y ejecutará lo que se le pide, devolviendo el resultado al cliente. 

Un apunte importante es que se a creado un tipo personalizado: 

```ts 
  /**
   * Type of the commands from the client 
   */
  export type commandType = {
    cmd: 'add' | 'mod' | 'read' | 'list' | 'del';
    user: string;
    noteTitle?: string;
    body?: string;
    color?: string;
    newTitle?: string;
  }
```

Esto permite almacenar las peticiones de un modo coherente y común entre servidor y cliente. Dichas opciones vienen determinadas (nuevamente) por la aplicación de notas. 

Código de la clase `Server`: 

```ts
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
```

La clase servidor es capaz de almacenar todo por su cuenta y gestionar las respuestas que el cliente verá en su pantalla.

Código de la clase `Client`:

```ts
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
```

En este caso, hereda de `EventEmitter` para crear sus eventos y tener las propiedades de un _emitter_.


### Salida de los comandos

A continuación se mostrarán las salidas de los comandos. A la izquierda, será un servidor ejecutándo, a la izquierda las peticiones del cliente.

#### Add

  ![](/assets/add.png)
  > Salida del comando

#### Mod

  ![](/assets/mod.png)
  > Salida del comando

#### Del

  ![](/assets/del.png)
  > Salida del comando

#### Read

  ![](/assets/read.png)
  > Salida del comando

#### List

  ![](/assets/list.png)
  > Salida del comando