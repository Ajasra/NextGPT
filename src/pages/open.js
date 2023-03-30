import Head from "next/head";
import styles from "../styles/Home.module.css";

import PromptForm from "../components/PromptForm";
import AnswerSection from "../components/AnswerSection";

import { Container, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import generate_prompt from "../utils/generate_prompt";

import { Howl, Howler } from "howler";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import prompts from "../data/prompts.json";
import LoginForm from "../components/Login";

const psw = process.env.NEXT_PUBLIC_SOKARIS_PSW;


export default function Home() {
  const [processing, setProcessing] = useState(false);
  const [storedValues, setStoredValues] = useState([]);

  async function requestAssistant(prompt, type, chat, setPrompt, selected) {
    
    setProcessing(true);

    let api_url = "/api/openSearch";
    if (BACKEND_URL !== undefined) {
      api_url = `${BACKEND_URL}/openSearch`;
    }

    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ messages: prompt, key: LOCAL_KEY }),
    });

    const json = await response.json().catch((err) => {
      console.error(err);
      setProcessing(false);
    });

    if (json.error !== null) {
      setStoredValues([
        ...storedValues,
        {
          question: prompt,
          type: "error",
          subtype: "",
          answer: "Connection error",
          selected: selected,
        },
      ]);
      setProcessing(false);
    } else {
      const answer = json.response;
      setStoredValues([
        ...storedValues,
        {
          question: prompt,
          type: type,
          subtype: "",
          answer: answer,
          selected: selected,
        },
      ]);
      setPrompt("");
      setProcessing(false);
    }
  }

  async function requestImage(prompt, setPrompt, selected) {

  }

  function regenerateResponse(index) {
    const response = storedValues[index];
    const prompt = response.question;
    const type = response.type === "error" ? "" : response.type;
    const chat = storedValues.slice(0, index);
    const selected = response.selected;
    function setPrompt() {}
    requestAssistant(prompt, type, chat, setPrompt, selected).then((r) => {
      // console.log(r);
    });
  }

  return (
    <>
      <Head>
        <title>Sokaris Assistant</title>
        <meta name="description" content="Sokaris assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={styles.main}>
        <Container className={styles.header}>
          <Title color="orange" className={styles.title}>
            🤖
          </Title>
          <Text>Hello, Ask me anything or select a chatbot from the menu.</Text>
          <Text color="red">
            Please do not overuse image generator as price per image is high.
            ($0.016 / image)
          </Text>
        </Container>

        <Container className={styles.chat_main}>
          {storedValues.length > 0 && (
            <AnswerSection
              storedValues={storedValues}
              regenerateResponse={regenerateResponse}
            />
          )}
          <PromptForm
            processing={processing}
            requestAssistant={requestAssistant}
            requestImage={requestImage}
            prompts={prompts}
          />
        </Container>
      </Container>
    </>
  );
}
