import 'dotenv/config';
import { httpServer } from './http-server';
import { WebSocketServer } from 'ws';

const HOST = '127.0.0.1';
const HTTP_PORT = parseInt((process.env.HTTP_PORT ?? '3000'), 10);
const WS_PORT = parseInt((process.env.WS_PORT ?? '8080'), 10);

httpServer.listen(HTTP_PORT, HOST, () => {
  console.info(`Start static http server on the ${HTTP_PORT} port!`);
});

const ws = new WebSocketServer({ port: WS_PORT });

// ws.on('connection', wsController);

ws.on('close', () => {
  console.info('Disconnected');
});
