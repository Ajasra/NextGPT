import React, { useEffect, useState } from "react";
import styles from "../../styles/AnswerSection.module.css";
import {
  Stack,
  Container,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { Code } from "@mantine/core";

import {ClipboardCopyIcon, PlayIcon, ReloadIcon} from "@radix-ui/react-icons";
import { Howl } from "howler";

const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

function formatAnswer(answer) {
  answer = answer.replace("Red pill", "🔴");
  answer = answer.replace("Blue pill", "🔵");
  answer = answer.replace("red pill", "🔴");
  answer = answer.replace("blue pill", "🔵");
  answer = answer.replace("black pill", "⚫");
  answer = answer.replace("Black pill", "⚫");
  answer = answer.replace("Positive analysis", "🟢");
  answer = answer.replace("Negative analysis", "🔴");
  answer = answer.replace("Neutral analysis", "🟡");
  answer = answer.replace("positive analysis", "🟢");
  answer = answer.replace("negative analysis", "🔴");
  answer = answer.replace("neutral analysis", "🟡");

  return answer;
}

export default function AnswerSection({ storedValues, regenerateResponse }) {
  
    function copyText(text) {
      navigator.clipboard.writeText(text);
    }

  const [speechFile, setSpeechFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(()=>{
    async function playSound(){
      let sound = new Howl({
        src: [speechFile], html5: true
      });
      // wait for the sound to load
      await sound.load();
      sound.play();
      setSpeechFile(null);
      setProcessing(false);
    }
    if(speechFile != null){
      playSound();
    }
  },[speechFile])



  async function generateSpeech(text){

    setProcessing(true);

    let api_url = "/api/elevenlabs";
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ messages: text, key: LOCAL_KEY }),
    });

    const json = await response.json().catch((err) => {
      console.error(err);
      setProcessing(false);
    });

    if (json.error === null) {
      const id = json.response;
      setSpeechFile(`/resp/response_${id}.mp3`);
    }
  }

  return (
    <Stack>
      <TypographyStylesProvider>
        {storedValues.map((value, index) => {
          return (
            <Container className={styles.answer_block} key={index}>
              <Text className={styles.question}>{value.question}</Text>
              <Text
                className={styles.answer}
                color={value.type == "error" ? "red" : ""}
              >
                <b>{value.type}</b>
                <br />
                <ReactMarkdown
                  components={{
                    code({ className, children }) {
                      return (
                        <Code
                          color="orange"
                          language={
                            className && className.replace("language-", "")
                          }
                          className={className}
                        >
                          {children}
                        </Code>
                      );
                    },
                  }}
                >
                  {formatAnswer(value.answer)}
                </ReactMarkdown>
              </Text>
              <div
                className={styles.copy_icon}
                onClick={
                 // copy the text to clipboard
                    () => copyText(value.answer)
                }
              >
                <ClipboardCopyIcon />
                <i className="fa-solid fa-copy"></i>
              </div>
              <div
                className={styles.play_icon}
                onClick={() => generateSpeech(value.answer)}
              >
                <PlayIcon />
                <i className="fa-solid fa-copy"></i>
              </div>
              <div
                  className={styles.reload_icon}
                  onClick={() => regenerateResponse(index)}
              >
                <ReloadIcon />
                <i className="fa-solid fa-copy"></i>
              </div>
            </Container>
          );
        })}
      </TypographyStylesProvider>
    </Stack>
  );
}
