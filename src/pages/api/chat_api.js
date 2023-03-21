const axios = require("axios");

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    
    let messages = req.body.messages;
    let key = req.body.key;
    
    // console.log(messages);

    if (key !== LOCAL_KEY) {
      res.status(404).json({ error: "Access denied" });
      return;
    }

    if (messages.length == 0) {
      res.status(404).json({ error: "Empty message" });
      return;
    }

    await axios
      .post(
        API_ENDPOINT,
        {
          model: "gpt-3.5-turbo",
          stream: false,
          temperature: 0.3,
          messages: messages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      )
      .then((response) => {
        const answer = response.data;
        res.status(200).json({ error: null, response: answer });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
    
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
