import React from "react";
import styles from "../../styles/AnswerSection.module.css";
import { Stack, Container, Title, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown'
import { Code } from '@mantine/core';

import { ClipboardCopyIcon } from '@radix-ui/react-icons'

export default function AnswerSection({ storedValues }) {
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Stack>
      {storedValues.map((value, index) => {
        return (
          <Container className={styles.answer_block} key={index}>
            <Text className={styles.question}>{value.question}</Text>
            <Text className={styles.answer}>
              <ReactMarkdown
                  components={{
                    code({className, children}) {
                      return(
                          <Code color="orange" language={className && className.replace('language-','')} className={className}>
                            {children}
                          </Code>
                      )
                    }
                  }}
              
              >{value.answer}</ReactMarkdown>
            </Text>
            <div className={styles.copy_icon} onClick={() => copyText(value.answer)}>
              <ClipboardCopyIcon />
              <i className="fa-solid fa-copy"></i>
            </div>
          </Container>
        );
      })}
    </Stack>
  );
}
