const axios = require("axios");

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let message = req.body.prompt;

    console.log(message);

    const response = await axios
      .post(
        API_ENDPOINT,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      )
      .then((response) => {
          const answer = response.data.choices[0].message.content;
          console.log(answer)
        res
          .status(200)
          .json({ error: null, answer: answer });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
