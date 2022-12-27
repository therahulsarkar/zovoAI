import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { Configuration, OpenAIApi } from 'openai'


dotenv.config()
const PORT = process.env.PORT || 5000;
// console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 5, // Limit each IP to 1 requests per `window` (here, per 5 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: function (req, res, /*next*/){
    return res.status(429).send({
      bot: 'You sent too many requests. Please wait a while then try again'
    })
}
})

const app = express()
app.use(cors())
app.use(express.json())
app.use(limiter)

app.get('/', async (req, res) => {
  res.status(200).json({
    msg: 'Welcome to zovoAI'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, 
      max_tokens: 3000,
      top_p: 1, 
      frequency_penalty: 0.5, 
      presence_penalty: 0, 
    
    });

    res.status(200).send({
      bot: response.data.choices[0].text
      // bot: "response.data.choices[0].text response.data.choices[0].text  response.data.choices[0].text  response.data.choices[0].text "
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong!');
  }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))