# Práctica 10: Sistema de fichero y creación de procesos en Node JS
## Juan Marrero Domínguez alu0101333823

### Introducción 

En esta práctica se proporcionarán la solución a unos retos con los que nos familiciaremos con la creación de procesos y el sistema de ficheros de Node JS.

Las tareas previas costan de: 
  - Aceptar la asignación como siempre
  - Familiariarizarse con la creación de procesos y callbas de Node 

### Ejercicio 1

### Ejercicio 2

Mediante el uso de `yargs` se crea un programa que nos permite contar el número de veces que una palabra aparezca en _fichero.txt_. Para ello usaremos los comandos de Linux `cat` y `grep` para obtener el texto sobre el que contar. Se hará de dos maneras: 
  1) Mediante el uso de el método `pipe`
  2) Sin el método `pipe`

Gracias al paquete `yargs` tenemos varios comandos que podemos ejecutar para la ejecución del programa. Las opciones son las siguientes: 
  - _--file_: comprende de el nombre del fichero
  - _--word_: palabra que contaremos sus apariciones
  - _pipe_: si contiene el valor 'y' o 'yes' usará la función que usa el método **pipe**. En cualquier otro caso no la usará.

Las salidas de ambos modos son así: 
  ![](/assets/out1.png)

El código de las funcionalidades:

```ts
  /**
   * Counts the number of times a word appear in a file using 'pipe' method
   * @param file to read 
   * @param word to count
   */
  export function pipeCounting(file: string, word: string) {
    if (fs.existsSync(file)) {
      const cat = spawn('cat', [file]);
      const grep = spawn('grep', [word]);
      console.log(`File content: `);
      // Paso de flujo gracias a pipe
      cat.stdout.pipe(grep.stdin);
      grep.stdout.pipe(process.stdout);
      // Separar el comando en array y contar la palabra de ahí 
      let grepOutput = '';
      grep.stdout.on('data', (piece) => grepOutput += piece);    
      grep.on('close', () => {
        const grepOutputArray = grepOutput.split(/\s+/);
        let counter: number = 0;
        // Contamos la aparición
        grepOutputArray.forEach((output) => {
          if (output === word) {
            counter++;
          }
        });
        console.log(`\nThe word "${word}" does appear ${counter} times.`);
      });
    } else {
      console.log('File does not exist');
    }
  }

  /**
   * Counts the number of times a word appear in a file using 'pipe' method
   * @param file to read 
   * @param word to count
   */
  export function nonPipeCounting(file: string, word: string) {
    if (fs.existsSync(file)) {
      const grep = spawn('grep', [word, file]);
      console.log(`File content: `);
      grep.stdout.pipe(process.stdout);

      // Separar el comando en array y contar la palabra de ahí 
      let grepOutput = '';
      grep.stdout.on('data', (piece) => grepOutput += piece);    
      grep.on('close', () => {
        const grepOutputArray = grepOutput.split(/\s+/);
        let counter: number = 0;
        // Contamos la aparición
        grepOutputArray.forEach((output) => {
          if (output === word) {
            counter++;
          }
        });
        console.log(`\nThe word "${word}" does appear ${counter} times.`);
      });
    } else {
      console.log('File does not exist');
    }
  }
```

### Ejercicio 3

En este ejercicio usaremos la app desarrollada en la práctica anterior para el manejo de notas. Ahora, la idea será crear un mecanismo para que gestione y detecte cambios en las carpetas de los usuarios de dicha aplicación de notas. Para seleccionar al usuario, _yargs_ nos ayudará a procesar las peticiones mediante la consola. El programa detectará cunaod haya un cambio en un fichero, cuando se cree uno nuevo y cuando uno se elimine.

Se nos proponen ciertas cuestiones antes de pasar al desarrollo: 
  - ¿Qué evento emite `watch` cuando se crea un fichero nuevo? El evento emitido es **rename**
  - ¿Y cuando se elimina? Se emite **rename** de igual manera
  - ¿Y cuando se modifica? Se emite **change**
  - ¿Cómo mostrar el contenido de la nota al cambiarla o crearla? Crearía un proceso `cat` mediante la funcionalidad `spawn`
  - ¿Cómo haría para vigilar todos los directorios de los usuarios? En vez de pasarle una ruta concreta de un usuario, le pasaría la ruta de `usersFolder` que contiene todos los directorios de los usuarios de la app de notas.

Bien, una vez esto pasamos al desarrollo. Todo el código se encuentra en el directorio `ejercicio-3`. Lo único nuevo añadido es el fichero `watchDirectory.ts`, que contiene el código _yargs_ para procesar el comando y la funcionalidad `watchDir`:

```ts
  /**
   * Watches a directory from an user. It any addition, deletion or change
   * @param user owner of the folder to be watched
   */
  export function watchDir(user: string) {
    const route = `src/ejercicio-3/usersFolder/` + user;
    fs.readdir(route, (err, prev) => {
      if (err) {
        console.log(`Cannot access the directory ${route}`);
      } else {
        fs.watch(route, (eventType, file) => {
          fs.readdir(route, (err, curr) => {
            if (err) {
              console.log(`Cannot access the directory ${route}`);
            } else {
              if (eventType === "rename") {
                if (prev.length < curr.length) {
                  console.log(`A new note added: "${file}"`);
                } else if (prev.length > curr.length) {
                  console.log(`A note has been deleted: "${file}"`);
                }
                prev = curr;
              }
              if (eventType === "change") {
                console.log(`The file "${file}" has been modified`);
              }
            }
          });
        });
      }
    });
  }

  /**
   * Comand that triggers the action to watch out for changes in the specified
   * user's directory
   */
  yargs.command( {
    command: 'watch',
    describe: 'Watches a users directory',
    builder: {
      user: {
        describe: 'Nombre de usuario del usuario',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      if (typeof argv.user === "string") {
        watchDir(argv.user);
      }
    },
  });
```

Gracias a la gestión de eventos de `watch()` comentada en las cuestiones anteriores, seremos capaces de deducir si un fichero ha sido modificado, añadido o eliminado.

  - Para averiguar si ha sido modificado es sencillo, comprobamos si el evento emitido es `'change'`.
  - Para eliminar o añadir, el evento es el mismo, `'rename'`. Entonces usaremos la función `readdir()`, que devuelve los elementos que se encuentran en dicho directorio. Esto resultará útil, pues leeremos el directorio dos veces: una antes de ejecutar la función `watch()` y otra después. Guardaremos en _prev_ los elementos de antes de ejecutar nuestro comando, y luego en _curr_ los elementos que hay después de ejecutar el comando. Si el evento es `'rename'` y _curr_ es mayor a _prev_ se habrá añadido una nota, si es el caso contrario se habrá eliminado.

La salida obtenida es: 

  ![](/assets/outadd3.png)

  ![](/assets/out3.png)

### Ejercicio 4

Haremos una aplicación que permita ejecutar comandos del sistema operativo. He creado una clase `Wrapper` para que contenga toda la funcionalidad necesaria. Dicha clase necesitará en su constructor la ruta de directorios sobre la que realizar las operaciones. Iré comentando cada funcionalidad por separado, pero tener en cuenta que todos pertenecen a la misma clase. El fichero app.js contiene el código _yargs_ para manejar los comandos de la app.

### isFolderOrFile()

Esta función te indica si la ruta es un directorio o un fichero de texto. La función se centra en `fs.lstatSync(this.route).isDirectory()`. Esta función del sistema hace exactamente lo que necesitamos:

```ts 
  /**
   * Shows if it is a folder or a file
   */
  public isFolderOrFile() {
    fs.access(this.route, (err) => {
      if (err) {
        console.log(`Cannot access to ${this.route}`);
      } else {
        if (fs.lstatSync(this.route).isDirectory()) {
          console.log(`"${this.route}" is a folder`);
        } else {
          console.log(`"${this.route}" is a file`);
        }
      }
    });
  }
```

  ![](/assets/outiff.png)
  > Ejecución del comando

### mkdir()

Crea un directorio en la ruta guardada en el objeto. `fs` contiene un método que nos realiza la tarea por nosotros:

```ts
  /**
   * Creates a directory
   */
  public mkdir() {
    if (fs.existsSync(this.route)) {
      console.log('This route already exist');
    } else {
      fs.mkdir(this.route, (err) => {
        if (err) {
          console.log(`Unable to "mkdir" at ${this.route}`);
        } else {
          console.log('Directory created succesfully!');
        }
      });
    }
  } 
```

  ![](/assets/outmkdir.png)
  > Ejecución del comando

### ls()

Lista todos los ficheros o directorios dentro de la ruta indicada, debe ser un directorio. Se consigue gracias a crear un proceso con la función `spawn()`.

```ts
  /**
   * List all files from a directory
   */
  public ls() {
    fs.access(this.route, (err) => {
      if (err) {
        console.log(`Cannot access to ${this.route}`);
      } else {
        const ls = spawn('ls', [this.route]);
        ls.stdout.pipe(process.stdout);
      }
    });
  }
```

  ![](/assets/outls.png)
  > Ejecución del comando

### cat() 

Lee el contenido de un fichero y muestra su contenido. La ruta indicada debe ser un fichero. Se consigue nuevamente gracias a la creación de un proceso con `spawn()`. 

```ts 
  /**
   * Shows the content of a file
   */
  public cat() {
    fs.access(this.route, (err) => {
      if (err) {
        console.log(`Cannot read from ${this.route}, is a directory`);
      } else {
        if (fs.lstatSync(this.route).isDirectory()) {
          console.log(`"${this.route}" is a folder. ERROR`);
        } else {
          const cat = spawn('cat', [this.route]);
          cat.stdout.pipe(process.stdout);
        }
      }
    });
  }
```

  ![](/assets/outcat.png)
  > Ejecución del comando

### remove()

Elimina la ruta indicada. Si es un fichero elimina también todo su contenido. De la misma manera, creamos un proceso `rm` con los flags `-rf` para asegurarnos que todo se borre perfectamente. 

```ts
  /**
   * Removes a folder with all of it's content or file
   */
  public remove() {
    fs.access(this.route, (err) => {
      if (err) {
        console.log(`Already deleted.`);
      } else {
        const rm = spawn('rm', ['-rf', this.route]);
        rm.on('close', () => {
          console.log(`Deletion successfull!`);
        });
      }
    });
  } 
```

  ![](/assets/outrm.png)
  > Ejecución del comando

### cp()

Copia la dirección que esté guardada en el constructor hacia una dirección destino que se le pase como parámetro a la función. En caso de que la ruta destino no exista, se crea. Creamos los procesos `spawn()` necesarios:

```ts 
  /**
   * Copies a route to a new one 
   * @param newRoute 
   */
  public cp(newRoute: string) {
    fs.access(this.route, (err) => {
      if (err) {
        console.log(`Cannot access to ${this.route}`);
      } else {
        if (fs.lstatSync(this.route).isDirectory()) {
          const cp = spawn('cp', ['-rf', this.route, newRoute]);
          cp.on('close', () => {
            console.log('Copy succeed!');
          });
        } else {
          const cp = spawn('cp', [this.route, newRoute]);
          cp.on('close', () => {
            console.log('Copy succeed!');
          });
        }
      }      
    });
  }
```

  ![](/assets/outcp.png)
  > Ejecución del comando

### mv()

Mueve la dirección que esté guardada en el constructor hacia una dirección destino que se le pase como parámetro a la función. En caso de que la ruta destino no exista, se crea. Creamos los procesos `spawn()` necesarios (es prácticamente igual que la función para copiar pero cambiando el comando del proceso):

```ts
  /**
   * Moves a route to a new one 
   * @param newRoute 
   */
  public mv(newRoute: string) {
    fs.access(this.route, (err) => {
      if (err) {
        console.log(`Cannot access to ${this.route}`);
      } else {
        if (fs.lstatSync(this.route).isDirectory()) {
          const mv = spawn('mv', ['-rf', this.route, newRoute]);
          mv.on('close', () => {
            console.log('Move succeed!');
          });
        } else {
          const mv = spawn('mv', [this.route, newRoute]);
          mv.on('close', () => {
            console.log('Move succeed!');
          });
        }
      }      
    });
  }
```

  ![](/assets/outmv.png)
  > Ejecución del comando