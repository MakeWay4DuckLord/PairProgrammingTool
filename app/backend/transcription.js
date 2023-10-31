const dotenv = require("dotenv")
dotenv.config()

const WebSocket = require('ws');

const { Deepgram } = require("@deepgram/sdk")

const client = new Deepgram(process.env.DEEPGRAM_API_KEY)
let keepAlive

var currentUtterance = {
    transcript: "",
    start_time: -1,
}

const setupDeepgram = () => {
    const deepgram = client.transcription.live({
      language: "en",
      punctuate: true,
      smart_format: true,
      model: "nova",
      timestamps: true,
      endpointing: 10, //number of miliseconds of pause to differentiate utterences
    });
  
    if (keepAlive) clearInterval(keepAlive);
    keepAlive = setInterval(() => {
      console.log("deepgram: keepalive");
      deepgram.keepAlive();
    }, 10 * 1000);
  
    deepgram.addListener("open", async () => {
      console.log("deepgram: connected");
  
      deepgram.addListener("close", async () => {
        console.log("deepgram: disconnected");
        clearInterval(keepAlive);
        deepgram.finish();
      });
  
      deepgram.addListener("error", async (error) => {
        console.log("deepgram: error recieved");
        console.error(error);
      });
  
      deepgram.addListener("transcriptReceived", (packet) => {
        // console.log("deepgram: packet received");
        const data = JSON.parse(packet);
        const { type } = data;
        switch (type) {
          case "Results":
            // console.log("deepgram: transcript received");
            const transcript = data.channel.alternatives[0].transcript ?? "";
            const words = data.channel.alternatives[0].words;
            
            //just skip this packet if there are no transcribed words
            if(words[0]){ 
                //add current data to the utterance variable
                currentUtterance.transcript = currentUtterance.transcript + " " + transcript;

                //if this is the start of a new uttterence update the start time
                if(currentUtterance.start_time === -1) {
                    //this will need some kind of offset for syncronization for interuption detection
                    currentUtterance.start_time = words[0].start;
                }
                
                //if this is the end of an utterance
                if(data.speech_final) {    
                    //send utterance to database (for now log it)
                    currentUtterance.end_time = words[words.length-1].end;
                    console.log("ok this should be an utterence:");
                    console.log(currentUtterance);
                    //reset the utterence variable
                    currentUtterance = {
                        transcript: "",
                        start_time: -1,
                    }
                }
            }

            // console.log(transcript); //will change to be sending stuff to database using the schemas sam made
            console.log(data.speech_final)
            console.log(transcript)

            break;
          case "Metadata":
            console.log("deepgram: metadata received");
            break;
          default:
            console.log("deepgram: unknown packet received");
            break;
        }
      });
    });
    return deepgram;
}

/**
 * Im not confident this is the best solution,
 * I want to keep the deepgram stuff in its own file
 * so that server.js is more readable. 
 */
async function startTranscription() {
    const wss = new WebSocket.Server({port: 42069});

    wss.on('connection', (ws) => {
        console.log('WebSocket connected');

        let deepgram = setupDeepgram();

        
        ws.on('message', (message) => {
            // console.log(`Received: client data`);

            if (deepgram.getReadyState() === 1 /* OPEN */) {
                // console.log("socket: data sent to deepgram");
                deepgram.send(message);
              } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
                console.log("socket: data couldn't be sent to deepgram");
                console.log("socket: retrying connection to deepgram");
                /* Attempt to reopen the Deepgram connection */
                deepgram.finish();
                deepgram.removeAllListeners();
                deepgram = setupDeepgram();
              } else {
                console.log("socket: data couldn't be sent to deepgram");
              }
            // You can process the message and send a response back if needed.
            ws.send('Server received your message.');

            
        });

        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    });
}

module.exports = startTranscription;