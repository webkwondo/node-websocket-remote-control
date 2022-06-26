import Jimp from 'jimp';
import robot from 'robotjs';

const drawLine = (x: number, y: number, length: number, direction = 'toright') => {
  for (let pointIndex = 0; pointIndex <= length; pointIndex++) {
    let xCoord = x;
    let yCoord = y;

    switch (direction) {
      case 'toright':
        xCoord = x + pointIndex;
        robot.dragMouse(xCoord, y);
        break;
      case 'toleft':
        xCoord = x - pointIndex;
        robot.dragMouse(xCoord, y);
        break;
      case 'down':
        yCoord = y + pointIndex;
        robot.dragMouse(x, yCoord);
        break;
      case 'up':
        yCoord = y - pointIndex;
        robot.dragMouse(x, yCoord);
        break;
      default:
        break;
    }
  }
};

const drawRectangle = (x: number, y: number, width: number, height: number) => {
  drawLine(x, y, width, 'toright');
  drawLine(x + width, y, height, 'down');
  drawLine(x + width, y + height, width, 'toleft');
  drawLine(x, y + height, height, 'up');
};

const drawCircle = (x: number, y: number, radius: number) => {
  for (let pointIndex = 0; pointIndex <= Math.PI * 2; pointIndex += 0.01) {
    const xCoord = x + (radius * Math.cos(pointIndex));
    const yCoord = y + (radius * Math.sin(pointIndex));
    robot.dragMouse(xCoord, yCoord);
  }
};

const prntScrn = (x: number, y: number, fn: (base64Str: string) => void, size = 200) => {
  const { width: screenWidth, height: screenHeight } = robot.getScreenSize();
  const scrnCoordXCalc = x - (size / 2);
  const scrnCoordYCalc = y - (size / 2);

  let scrnCoordX = scrnCoordXCalc;

  if (scrnCoordXCalc < 0) {
    scrnCoordX = 0;
  } else if ((scrnCoordXCalc + size) > screenWidth) {
    scrnCoordX = screenWidth - size;
  } else {
    scrnCoordX = scrnCoordXCalc;
  }

  let scrnCoordY = scrnCoordYCalc;

  if (scrnCoordYCalc < 0) {
    scrnCoordY = 0;
  } else if ((scrnCoordYCalc + size) > screenHeight) {
    scrnCoordY = screenHeight - size;
  } else {
    scrnCoordY = scrnCoordYCalc;
  }

  const img = robot.screen.capture(scrnCoordX, scrnCoordY, size, size);
  const bitmap = img.image;
  const data = [];

  for (let i = 0; i < bitmap.length; i += 4) {
    data.push(bitmap[i + 2], bitmap[i + 1], bitmap[i], bitmap[i + 3]);
  }

  new Jimp({
    'data': new Uint8Array(data),
    'width': img.width,
    'height': img.height
  }, async (error: Error, image: any) => {
    if (error) {
      console.error(error);
    } else {
      const base64 = await image.getBase64Async(Jimp.MIME_PNG);
      const pureBase64 = base64.slice(('data:image/png;base64,').length);

      if (fn) {
        fn(pureBase64);
      }
    }
  });
};

export { drawLine, drawRectangle, drawCircle, prntScrn };
