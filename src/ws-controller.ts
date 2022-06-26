import robot from 'robotjs';
import { createWebSocketStream } from 'ws';

export const wsController = async (connection: any) => {

  const duplex = createWebSocketStream(connection, { encoding: 'utf8', decodeStrings: false });

  duplex.on('data', async (chunk) => {
    const message = chunk;

    console.info('Received: %s', message);

    let [command, amount1, amount2] = message.toString().split(' ');
    amount1 = parseInt(amount1, 10);
    amount2 = parseInt(amount2, 10);
    const { x: xPos, y: yPos } = robot.getMousePos();
    let xPosNew;
    let yPosNew;

    switch (command) {
      case 'mouse_up':
        const yAmountUp = amount1;
        yPosNew = yPos - yAmountUp;
        robot.moveMouse(xPos, yPosNew);
        duplex.write(`mouse_up\0`);
        console.info('Mouse moved up by', yAmountUp, ',', 'Mouse position:', xPos, yPosNew);
        break;
      case 'mouse_down':
        const yAmountDown = amount1;
        yPosNew = yPos + yAmountDown;
        robot.moveMouse(xPos, yPosNew);
        duplex.write(`mouse_down\0`);
        console.info('Mouse moved down by', yAmountDown, ',', 'Mouse position:', xPos, yPosNew);
        break;
      case 'mouse_left':
        const xAmountLeft = amount1;
        xPosNew = xPos - xAmountLeft;
        robot.moveMouse(xPosNew, yPos);
        duplex.write(`mouse_left\0`);
        console.info('Mouse moved left by', xAmountLeft, ',', 'Mouse position:', xPosNew, yPos);
        break;
      case 'mouse_right':
        const xAmountRight = amount1;
        xPosNew = xPos + xAmountRight;
        robot.moveMouse(xPosNew, yPos);
        duplex.write(`mouse_right\0`);
        console.info('Mouse moved right by', xAmountRight, ',', 'Mouse position:', xPosNew, yPos);
        break;
      case 'mouse_position':
        duplex.write(`mouse_position ${xPos},${yPos}\0`);
        console.info('Mouse position:', xPos, yPos);
        break;
      case 'draw_circle':
        const r = amount1;
        duplex.write(`draw_circle\0`);
        robot.mouseToggle('down');
        robot.mouseToggle('down');
        // drawCircle(xPos - r, yPos, r);
        robot.mouseToggle('up');
        console.info('Circle with radius', r);
        break;
      case 'draw_rectangle':
        const w = amount1;
        const h = amount2;
        duplex.write(`draw_rectangle\0`);
        robot.mouseToggle('down');
        robot.mouseToggle('down');
        // drawRectangle(xPos, yPos, w, h);
        robot.mouseToggle('up');
        console.info('Rectangle with width', w, 'and height', h);
        break;
      case 'draw_square':
        const side = amount1;
        duplex.write(`draw_square\0`);
        robot.mouseToggle('down');
        robot.mouseToggle('down');
        // drawRectangle(xPos, yPos, side, side);
        robot.mouseToggle('up');
        console.info('Square with side', side);
        break;
      case 'prnt_scrn':
        break;
      default:
        break;
    }

  });
};
