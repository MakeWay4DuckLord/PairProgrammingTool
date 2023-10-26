const dotenv = require("dotenv")
dotenv.config()

const { Deepgram } = require("@deepgram/sdk")

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)

const start = async function () {
    const result = await deepgram.projects.list()
    console.log(result)
}

start()