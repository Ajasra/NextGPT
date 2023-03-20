import React from "react";
import styles from "../../styles/AnswerSection.module.css";
import {
  Stack,
  Container,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { Code } from "@mantine/core";

import { ClipboardCopyIcon } from "@radix-ui/react-icons";

function formatAnswer(answer) {
  answer = answer.replace("Red pill", "🔴");
  answer = answer.replace("Blue pill", "🔵");

  return answer;
}

export default function AnswerSection({ storedValues }) {
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Stack>
      <TypographyStylesProvider>
        {storedValues.map((value, index) => {
          return (
            <Container className={styles.answer_block} key={index}>
              <Text className={styles.question}>{value.question}</Text>
              <Text className={styles.answer} color={value.type == 'error' ? "red" : ""}>
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
                onClick={() => copyText(value.answer)}
              >
                <ClipboardCopyIcon />
                <i className="fa-solid fa-copy"></i>
              </div>
            </Container>
          );
        })}
      </TypographyStylesProvider>
    </Stack>
  );
}
