const { Configuration, OpenAIApi } = require("openai");

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    
    let messages = req.body.messages;
    let key = req.body.key;

    if (key !== LOCAL_KEY) {
      res.status(404).json({ error: "Access denied" });
      return;
    }

    if (messages.length == 0) {
      res.status(404).json({ error: "Empty message" });
      return;
    }
  
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: false,
        temperature: 0.3,
      messages: messages,
    }).then((response) => {
      const answer = response.data;
      res.status(200).json({ error: null, response: answer });
    }).catch((error) => {
      res.status(500).json({ error: error });
    });
    
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
