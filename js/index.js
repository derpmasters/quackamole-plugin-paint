const output = document.getElementById('output');
const btnSendRandom = document.getElementById('send-random');
const quackamole = new Quackamole();

const getRandomNumber = () => {
    return Math.round(Math.random() * 1000);
};

btnSendRandom.addEventListener('click', () => {
   const data = {randomNumber: getRandomNumber()};
    quackamole.broadcastData('RANDOM_NUMBER', data);
});

quackamole.eventManager.on('RANDOM_NUMBER', ({randomNumber}) => {
    output.innerText = '' + payload.randomNumber;
});
