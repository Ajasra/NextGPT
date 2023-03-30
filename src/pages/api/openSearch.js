const { Configuration, OpenAIApi } = require("openai");
import { OpenAI } from "langchain/llms";
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI, Calculator } from "langchain/tools";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

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

    const model = new OpenAI({
      temperature: 0.3,
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const tools = [
      new SerpAPI((key = process.env.NEXT_PUBLIC_SERPAPI_KEY)),
      new Calculator(),
    ];
    const executor = await initializeAgentExecutor(
      tools,
      model,
      "zero-shot-react-description"
    );
    // console.log("Loaded agent.");

    const input = messages;
    // console.log(`Executing with input "${input}"...`);

    //Run the agents
    const result = await executor
      .call({ input })
      .then((result) => {
        console.log(`Got output ${result.output}`);

        res.status(200).json({ error: null, response: result.output });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
