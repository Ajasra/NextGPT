import Head from "next/head";
import styles from "../styles/Home.module.css";

import PromptForm from "../components/PromptForm";
import AnswerSection from "../components/AnswerSection";

import { Container, Title, Text } from "@mantine/core";
import { useState } from "react";

export default function Home() {
  const [processing, setProcessing] = useState(false);
  const [storedValues, setStoredValues] = useState([
  ]);

  async function generateResponse(prompt, setPrompt, checked, type) {
    setProcessing(true);

    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt, chat: checked, values: storedValues, type: type }),
    });

    const json = await response.json().catch((err) => {
        console.error(err);
        setProcessing(false);
    });
    if (json.error !== null) {
      console.error(json.error);
      setProcessing(false);
    } else {
      console.log(json);
      setStoredValues([
        ...storedValues,
        {
          question: prompt,
          answer: json.answer,
        }
        
      ]);
      setPrompt("");
      setProcessing(false);
    }
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
          <Title color="orange" className={styles.title}>Sokaris ChatGPT 🤖</Title>
          {storedValues.length < 1 && (
            <Text>
              I am an automated question and answer system, designed to assist
              you in finding relevant information. You are welcome to ask me any
              queries you may have, and I will do my utmost to offer you a
              reliable response. Kindly keep in mind that I am a machine and
              operate solely based on programmed algorithms.
            </Text>
          )}
        </Container>
        <Container className={styles.chat_main}>
          {storedValues.length > 0 && (
            <AnswerSection storedValues={storedValues} />
          )}
          <PromptForm
            processing={processing}
            generateResponse={generateResponse}
          />
        </Container>
      </Container>
    </>
  );
}
