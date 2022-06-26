import fs from 'fs';
import path from 'path';
import http from 'http';

export const httpServer = http.createServer(async (req, res) => {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);

  try {
    const readableStream = fs.createReadStream(file_path);
    res.writeHead(200);
    readableStream.pipe(res);
    readableStream.on('close', () => res.end());
    return;
  } catch (error) {
    res.writeHead(404);
    res.end(JSON.stringify(error));
    return;
  }
});
