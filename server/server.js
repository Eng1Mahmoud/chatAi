import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from AI Chat",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const completion = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    completion.then((response) => {
      const botResponse = response.data.choices[0].message.content;
      console.log(botResponse);
      res.status(200).send({
        bot: botResponse,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});



// listen for requests
app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
