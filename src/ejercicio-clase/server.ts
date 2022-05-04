import { spawn } from 'child_process';
import * as net from 'net';

const server = net.createServer((conection => {
  console.log('Conexión establecida!');
  conection.write('Servidor en el puerto 60300');

  let msg: string = '';
  conection.on('data', (data) => {
    console.log(`El cliente me ha enviado: ${data}`);
    msg += data;
  });
  
  conection.on('close', () => {
    const msgJSON = JSON.parse(msg);
    const command = spawn(msgJSON.command, msgJSON.arguments);

    console.log('Salida del comando solicitado: ');

    let commandOut = ''; 
    command.stdout.pipe(process.stdout);
    command.stdout.on('data', (piece) => commandOut += piece);
  });

  conection.on('error', (err) => {
    if (err) {
      console.log('Ha ocurrido un error durante la conexión');
    }
  })
}));

server.listen(60300, () => {
  console.log('Esperando a conectar con el cliente...');
});