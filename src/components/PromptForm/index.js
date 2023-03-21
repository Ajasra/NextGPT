import {
  Textarea,
  Button,
  Center,
  Container,
  Checkbox,
  Select,
} from "@mantine/core";
import { useState } from "react";
import styles from "../../styles/PromptForm.module.css";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const VERSION = process.env.NEXT_PUBLIC_VERSION;

export default function PromptForm(props) {
  const { processing, generateResponse, requestAssistant } = props;

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const [type, setType] = useState("Assistant");

  function sendRequest() {
    if (prompt === "") {
      setError("Can't be empty");
    } else {
      setError("");
      if (VERSION === 2) {
        requestAssistant(prompt, type, checked, setPrompt);
      } else {
        console.log("Old version");
        generateResponse(prompt, setPrompt, checked, type);
      }
    }
  }

  return (
    <Container className={styles.form_section} shadows="md">
      <Container>
        <Checkbox
          className={styles.checkbox}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label="Follow conversation"
        />
        <Select
          className={styles.select}
          label="Assistant type"
          placeholder="Assistant"
          searchable
          onSearchChange={setType}
          searchValue={type}
          nothingFound="No options"
          data={[
            "Assistant",
            "Translate to chinese",
            "Translate to english",
            "Summarize",
            "Summarize short",
            "Explain",
            "Lazy",
            "Three hat",
            "Morpheus",
            "Stoic",
          ]}
          defaultValue={type}
        />
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
