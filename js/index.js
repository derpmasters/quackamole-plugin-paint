const output = document.getElementById('output');
const btnSendRandom = document.getElementById('send-random');

const getRandomNumber = () => {
    return Math.round(Math.random() * 1000);
};

// send message from iframe ===> parent
btnSendRandom.addEventListener('click', () => {
   console.log('sending random number');
   const randomNumber = getRandomNumber();
   const data = {
       type: 'broadcast',
       payload: {randomNumber}
   };
    output.innerText = '' + randomNumber;
    window.top.postMessage(data, '*');
});

// receive messages from parent ===> iframe
window.addEventListener('message', (event) => {
    console.log('plugin received message', event);
    if (event.data.type === 'pluginData') {
        output.innerText = '' + event.data.payload.randomNumber;
        console.log('random number received', event);
    }
});
