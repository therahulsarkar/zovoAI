import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { Configuration, OpenAIApi } from 'openai'
import { v4 as uuidv4 } from 'uuid';



dotenv.config()
const PORT = process.env.PORT || 5000;
// console.log(process.env.OPENAI_API_KEY)

// const configuration = new Configuration({
//   apiKey: process.env.API_KEY,
// });

// const openai = new OpenAIApi(configuration);
const app = express()

// app.use((req, res, next) => {
//   let userId = req.cookies.userId; // try to get the user ID from the cookie
//   if (!userId) { // if the cookie doesn't exist, generate a new ID
//     userId = uuidv4(); // generate a new UUIDv4
//     res.cookie('userId', userId, { maxAge: 24 * 60 * 60 * 1000 }); // store the new ID in a cookie that expires in 24 hours
//   }
//   req.userId = userId; // attach the user ID to the request object
//   next();
// });

// const keyGenerator = (req) => {
//   return req.userId;
// };



const limiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 1 Day
	max: 7, // Limit each IP to 1 requests per `window` (here, per 5 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // keyGenerator: keyGenerator, 
  handler: function (req, res, /*next*/){
    return res.status(429).send({
      bot: 'You sent too many requests. Please wait a while then try again'
    })
}
})


app.use(cors())
app.use(express.json())
app.use(limiter)

app.get('/', async (req, res) => {
  res.status(200).json({
    msg: `Welcome to zovoAI your ip is: ${req.ip}`
  })
})

app.post('/', async (req, res) => {
  try {
    const data = req.ip;
    // const prompt = req.body.prompt;

    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `${prompt}`,
    //   temperature: 0, 
    //   max_tokens: 3000,
    //   top_p: 1, 
    //   frequency_penalty: 0.5, 
    //   presence_penalty: 0, 
    
    // });

    res.status(200).send({
      data: data
      // bot: response.data.choices[0].text
      // bot: "response.data.choices[0].text response.data.choices[0].text  response.data.choices[0].text  response.data.choices[0].text "
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong!');
  }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))