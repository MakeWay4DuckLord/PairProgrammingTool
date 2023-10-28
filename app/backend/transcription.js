const dotenv = require("dotenv")
dotenv.config()

const WebSocket = require('ws');

const { Deepgram } = require("@deepgram/sdk")

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)

const start = async function () {
    const result = await deepgram.projects.list()
    console.log(result)
}

/**
 * Im not confident this is the best solution,
 * I want to keep the deepgram stuff in its own file
 * so that server.js is more readable. 
 */
function startTranscription() {
    const wss = new WebSocket.Server({port: 42069});

    wss.on('connection', (ws) => {
        console.log('WebSocket connected');

        ws.on('message', (message) => {
            console.log(`Received: ${message}`);
            // You can process the message and send a response back if needed.
            ws.send('Server received your message.');
            start();
        });

        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    });
}

start()

module.exports = startTranscription;