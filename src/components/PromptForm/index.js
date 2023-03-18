import { Textarea, Button, Center, Container } from "@mantine/core";
import { useState } from "react";
import styles from "../../styles/PromptForm.module.css";

export default function PromptForm(props) {
  const { processing, generateResponse } = props;

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  function sendRequest() {
    if (prompt == "") {
      setError("Can't be empty");
    } else {
      setError("");
      generateResponse(prompt, setPrompt);
    }
  }

  return (
    <Container className={styles.form_section} shadows="md">
      <Container>
        <Textarea
          placeholder="Ask me anything..."
          withAsterisk
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          error={error}
        />
        <Center>
          <Button
            radius="md"
            size="md"
            disabled={processing}
            onClick={sendRequest}
            className={styles.ask_button}
          >
            {processing ? "Processing..." : "Ask"}
          </Button>
        </Center>
      </Container>
    </Container>
  );
}
