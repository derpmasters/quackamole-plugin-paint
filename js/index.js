const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const quackamole = new Quackamole();
const colorPalette = document.getElementById('palette');
const lineWidthInput = document.getElementById('line-width-input');

let DRAW_STATES = {
    NOT_DRAWING: 'not-drawing',
    STARTING: 'starting',
    DRAWING: 'drawing',
    STOPPING: 'stopping'
};

let currentDrawState = DRAW_STATES.NOT_DRAWING;
let lastXY = null;

let recordedPathCoords = [];
let availableColors = ['white', 'black', '#4D9221', '#D92405', '#3563EB', '#EAC124'];
let currentColor = availableColors[2];

const drawFromRecording = ({drawnLines, lineWidth, color}) => {
    for (let i = 1; i < drawnLines.length; i++) {
        const lastXY = drawnLines[i - 1];
        const currentXY = drawnLines[i];
        CanvasUtils.drawLine(ctx, lastXY, currentXY, lineWidth, color);
    }
}

//////////////////////////
// QUACKAMOLE SDK STUFF //
//////////////////////////
const sendData = (drawnLines, color, lineWidth) => {
    quackamole.broadcastData('DRAW_DATA', {drawnLines, color, lineWidth});
};

quackamole.eventManager.on('DRAW_DATA', (recording) => {
    drawFromRecording(recording);
});


////////////////////////
// DOM EVENT HANDLERS //
////////////////////////
const handleStartDraw = (evt) => {
    currentDrawState = DRAW_STATES.STARTING;
};

const handleDraw = (evt) => {
    if (currentDrawState === DRAW_STATES.NOT_DRAWING) return;
    const currentXY = CanvasUtils.getScaledMousePosition(ctx, evt);
    console.log('XY', currentXY);
    recordedPathCoords.push(currentXY);
    if (recordedPathCoords.length > 4) {
        const recording = lastXY ? [lastXY, ...recordedPathCoords] : recordedPathCoords;
        sendData(recording, currentColor, lineWidthInput.value);

        if (currentDrawState === DRAW_STATES.DRAWING) {
            lastXY = recordedPathCoords[recordedPathCoords.length - 1];
        }
        recordedPathCoords = [];
    }
    currentDrawState = DRAW_STATES.DRAWING;
};

const handleStopDraw = evt => {
    if (currentDrawState !== DRAW_STATES.NOT_DRAWING) {
        currentDrawState = DRAW_STATES.NOT_DRAWING;
        sendData(recordedPathCoords, currentColor, lineWidthInput.value);
        recordedPathCoords = [];
        lastXY = null;
    }
};

canvas.addEventListener('mousedown', handleStartDraw);
canvas.addEventListener('mousemove', handleDraw);
canvas.addEventListener('mouseup', handleStopDraw);

canvas.addEventListener('touchstart', handleStartDraw);
canvas.addEventListener('touchmove', handleDraw);
canvas.addEventListener('touchend', handleStopDraw);

//////////////////////
// INITIALIZE STUFF //
//////////////////////
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.95;

availableColors.forEach((color, i) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-color');
    button.style.backgroundColor = availableColors[i];
    button.onclick = () => currentColor = availableColors[i];
    colorPalette.appendChild(button);
});
