const { Configuration, OpenAIApi } = require("openai");

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    
    let messages = req.body.messages;
    let size = req.body.size;
    let key = req.body.key;

    if (key !== LOCAL_KEY) {
      res.status(404).json({ error: "Access denied" });
      return;
    }

    if (messages.length == 0) {
      res.status(404).json({ error: "Empty message" });
      return;
    }
  
    const response = await openai.createImage({
      prompt: messages,
      n: 1,
      size: "256x256",
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
