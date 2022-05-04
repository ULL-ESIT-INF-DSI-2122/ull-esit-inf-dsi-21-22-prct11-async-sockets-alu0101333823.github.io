import * as net from 'net';
import { argv } from 'process';


if (process.argv.length < 3) {
  console.log('Escribe un comando');
} else {
  const client = net.connect({port: 60300});
  const command = argv[2];
  const args = argv.splice(3);
  
  client.write(JSON.stringify({
    'command': command, 'arguments': args}), () => {
  });
  
  
  let output = '';
  client.on('data', (data) => {
    output += data;
    client.end();
    
  }).on('end', () => {
    console.log(output);
    console.log('Conexión finalizada sin errores');
  }).on('error', (err) => {
    if (err) {
      console.log('Ha ocurrido un error durante la conexión');
    }
  })
}