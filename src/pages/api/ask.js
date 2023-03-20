const axios = require("axios");

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let message = req.body.prompt;
    let chat = req.body.chat;
    let values = req.body.values;
    let type = req.body.type;

    let msgs = [];

    if (type == "Translate to chinese") {
      msgs.push({
        role: "system",
        content:
          "You are a helpful assistant that translates English to Chinese.",
      });
      msgs.push({
        role: "user",
        content: `Translate the following English text to Chinese: "${message}"`,
      });
    } else if (type == "Translate to english") {
      msgs.push({
        role: "system",
        content:
          "You are a helpful assistant that translates Chinese to English.",
      });
      msgs.push({
        role: "user",
        content: `Translate the following Chinese text to English: "${message}"`,
      });
    } else if (type == "Summarize") {
      msgs.push({
        role: "system",
        content: "You are a helpful assistant that summarizes text.",
      });
      msgs.push({
        role: "user",
        content: `Summarize the following text: "${message}"`,
      });
    } else if (type == "Summarize short") {
      msgs.push({
        role: "system",
        content: "You are a helpful assistant that summarizes short text.",
      });
      msgs.push({
        role: "user",
        content: `Summarize the following text in a one paragraph: "${message}"`,
      });
    } else if (type == "Explain") {
      msgs.push({
        role: "system",
        content:
          "Imagine you are an expert at explaining complex things in very simple to understand ways. You are going to explain a topic I will give you. To explain the topic you will Start by Brief introduction: Provide a brief introduction to the topic, giving some background information to set the stage for your explanation. Historical context: provide some historical context to give your audience a deeper understanding of the topic. Overview of current knowledge: Discuss what is currently known about the topic, based on research and documentation. Explore 3  best tactics for dealing with issues highlighted in the topic through the use of primary sources like eyewitness accounts, interviews, memoirs, scientific documents, etc. introduce a secondary source of information, such as research done by others and uncovered new facts and versions of the events in the topic. Commbine the primary and secondary sources together to provide a strong sense of the topic being explained and bring the audience the best experience and most accurate information. Conclusion: Sum up your explanation and restate the importance information provided.",
      });
      msgs.push({
        role: "user",
        content: `The topic is ${message}`,
      });
    } else if (type == "Morpheus") {
      msgs.push({
        role: "system",
        content:
          "You are the Morpheus. I'm the Neo. You always reply to me by giving me two choice. The red pill and the blue pill. The red pill represents the truth, no matter how harsh or uncomfortable it may be, while the blue pill represents the illusion of security, comfort, and ignorance. Your answer in the format: red pill: ... , blue pill: ...",
      });
      msgs.push({
        role: "user",
        content: `${message}`,
      });
    } else if (type == "Lazy") {
      msgs.push({
        role: "system",
        content: "You are a very lazy and sarcastic assistant.",
      });
      msgs.push({
        role: "user",
        content: `${message}`,
      });
    } else if (type == "Three hat") {
      msgs.push({
        role: "system",
        content:
          "You will give three perspective on the next message. Positive, negative and neutral analysis.",
      });
      msgs.push({
        role: "user",
        content: `${message}`,
      });
    } else {
      // msgs.push({ role: "system", content: "You are helpful and creative assistant." });
      if (chat) {
        values.forEach((value) => {
          msgs.push({ role: "user", content: value.question });
          msgs.push({ role: "assistant", content: value.answer });
        });
      }
      msgs.push({ role: "user", content: message });
    }

    console.log(msgs);

    const response = await axios
      .post(
        API_ENDPOINT,
        {
          model: "gpt-3.5-turbo",
          messages: msgs,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // "Accept": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      )
      .then((response) => {
        const answer = response.data.choices[0].message.content;
        console.log(answer);
        res.status(200).json({ error: null, answer: answer });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
