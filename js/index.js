const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const quackamole = new Quackamole();

let lastXY = null;
let lastLineWidth = null;
let recordedPathCoords = [];
let availableColors = ['red', 'green', 'black', 'yellow'];
let currentColor = availableColors[0];

const colorPalette = document.getElementById('palette');
const lineWidthInput = document.getElementById('line-width-input');
availableColors.forEach((color, i) => {
   const button = document.createElement('button');
   button.classList.add('btn', 'btn-color');
   button.style.backgroundColor = availableColors[i];
   button.onclick = () => currentColor = availableColors[i];
   colorPalette.appendChild(button);
});

const resizeCanvas = () => {
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.95;
};

resizeCanvas();

const sendData = (drawnLines, color, lineWidth) => {
    quackamole.broadcastData('DRAW_DATA', {drawnLines, color, lineWidth});
};

quackamole.eventManager.on('DRAW_DATA', ({drawnLines, color, lineWidth}) => {
    console.log('on DRAW_DATA received', drawnLines);
    drawFromRecording(drawnLines, color, lineWidth);
});

const handleDraw = (evt) => {
    // TODO make generic enough to reuse with received peer data. Wrap handler logic in separate fn
    const currentXY = CanvasUtils.getScaledMousePosition(ctx, evt);
    lastXY = lastXY || currentXY;

    // reduce line width the quicker pointing device is moved
    const distance = VectorUtils.distance(lastXY, currentXY);
    const falloff = Math.max(Math.min((distance / -100) + 1, 1), 0.1);
    let currentLineWidth = lineWidthInput.value * falloff;

    // prevent sudden line width differences
    if (lastLineWidth) {
        const min = lastLineWidth * 0.95;
        const max = lastLineWidth * 1.05;
        currentLineWidth = Math.max(Math.min(currentLineWidth, max), min);
    }

    // CanvasUtils.drawLine(ctx, lastXY, currentXY, currentLineWidth, currentColor);
    recordedPathCoords.push(currentXY);
    lastLineWidth = currentLineWidth;
    lastXY = currentXY;
};

const drawFromRecording = (recordedPathCoords) => {
    for (let i = 1; i < recordedPathCoords.length; i++) {
        const lastXY = recordedPathCoords[i-1];
        const currentXY = recordedPathCoords[i];

        CanvasUtils.drawLine(ctx, lastXY, currentXY, 5, 'red');
    }
}

canvas.addEventListener('mousedown', (evt) => {
    canvas.addEventListener('mousemove', handleDraw);
})

canvas.addEventListener('mouseup', (evt) => {
    canvas.removeEventListener('mousemove', handleDraw);
    sendData(recordedPathCoords, currentColor, lineWidthInput.value);
    lastLineWidth = null;
    recordedPathCoords = [];
    lastXY = null;
})
