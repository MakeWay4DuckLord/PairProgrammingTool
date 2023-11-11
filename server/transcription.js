const dotenv = require("dotenv")
dotenv.config()

const WebSocket = require('ws');

const axios = require('axios');

const { Deepgram } = require("@deepgram/sdk")

const client = new Deepgram(process.env.DEEPGRAM_API_KEY)
let keepAlive;

let localStartTime;

var currentUtterance = {
    user_id: "sentinel",
    start_time: -1,
    transcript: "",
    end_time: -1,
}

const setupDeepgram = () => {
    const deepgram = client.transcription.live({
      language: "en",
      punctuate: true,
      smart_format: true,
      model: "nova",
      timestamps: true,
      endpointing: 10, //number of milliseconds of pause to differentiate utterances, may want to be tweaked
    });

    
    if (keepAlive) clearInterval(keepAlive);
    keepAlive = setInterval(() => {
        console.log("deepgram: keepalive");
        deepgram.keepAlive();
    }, 10 * 1000);
    
    deepgram.addListener("open", async () => {
        console.log("deepgram: connected");

        //get epoch time for synchronization when deepgram connection opens
        localStartTime = Date.now() / 1000; 
        console.log(localStartTime);
  
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
        console.log("deepgram: packet received");
        const data = JSON.parse(packet);
        const { type } = data;
        switch (type) {
          case "Results":
            console.log("deepgram: transcript received");
            const transcript = data.channel.alternatives[0].transcript ?? "";
            const words = data.channel.alternatives[0].words;
            
            //only update current utterance if this packet has at least one word
            if(words[0]){ 

                //add current transcript to the utterance variable
                currentUtterance.transcript = currentUtterance.transcript + " " + transcript;

                //if this is the start of a new utterance update the start time
                if(currentUtterance.start_time === -1) {
                    //this will need some kind of offset for syncronization for interuption detection
                    currentUtterance.start_time = words[0].start + localStartTime;
                }

                //update end time
                currentUtterance.end_time = words[words.length-1].end + localStartTime;
                
            }

            //if end of utterance, and currentUtterance has any data in it, post to database and reset
            if(data.speech_final && currentUtterance.transcript.length > 0) {
                //post to database    
                axios.post(process.env.API_URL + "/api/utterances", currentUtterance)

                //log utterance for debugging
                console.log(currentUtterance);

                //reset the utterance variable
                currentUtterance.transcript = "";
                currentUtterance.start_time = -1;
            }

            // console.log(data.speech_final)
            // console.log(transcript)

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

async function startTranscription() {
    const wss = new WebSocket.Server({port: 42069});


    wss.on('connection', (ws) => {
        console.log('WebSocket connected');
        let deepgram = setupDeepgram();
        
        // console.log(`Received: client data`);
        
        ws.on('message', (message) => {
            //this should only happen once
            // console.log(message);
            if(currentUtterance.user_id === "sentinel") {
                console.log('first message:')
                currentUtterance.user_id = message;
                
                // console.log(message);
                // axios.post(process.env.API_URL + "/api/utterances", {"user_id":"User2618","start_time":1699122557.522,"end_time":1699122558.022,"transcript":" Hello?"});
            } else {
                if (deepgram.getReadyState() === 1 /* OPEN */) {
                    // console.log("socket: data sent to deepgram");
                    deepgram.send(message);
                    // console.log(message);
                  } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
                    console.log("socket: data couldn't be sent to deepgram");
                    console.log("socket: retrying connection to deepgram");
                    /* Attempt to reopen the Deepgram connection */
                    deepgram.finish();
                    deepgram.removeAllListeners();
                    deepgram = setupDeepgram();
                  } else {
                    console.log("socket: data couldn't be sent to deepgram");
                    console.log(deepgram.getReadyState());
                  }
            }
            ws.send('Server received your message.');

            
        });
        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    });
}

module.exports = startTranscription;