import {
  Textarea,
  Button,
  Center,
  Container,
  Checkbox,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import styles from "../../styles/PromptForm.module.css";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const VERSION = process.env.NEXT_PUBLIC_VERSION;

export default function PromptForm(props) {
  const { processing, requestAssistant, requestImage, prompts } = props;

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const [type, setType] = useState("");
  const [subtype, setSubtype] = useState("");

  const [selected, setSelected] = useState({ type: 0, subtype: 0 });

  const [typeList, setTypeList] = useState([]);
  const [subList, setSubList] = useState([]);
  const [chat, setChat] = useState(false);
  const [helpText, setHelpText] = useState("");

  useEffect(() => {
    let types = [];
    for (let i = 0; i < prompts.length; i++) {
      types.push({
        value: prompts[i].id,
        label: prompts[i].type,
      });
    }
    if (types.length > 0) {
      setTypeList(types);
      setType("");
      setSubtype("");
    }
  }, []);

  useEffect(() => {
    if (type !== undefined) {
      let subtypes = [];
      for (let i = 0; i < prompts.length; i++) {
        if (prompts[i].type === type) {
          for (let j = 0; j < prompts[i].sub.length; j++) {
            subtypes.push({
              value: prompts[i].sub[j].id,
              label: prompts[i].sub[j].subtype,
            });
          }
          setSubList(subtypes);
          setSelected({ type: i, subtype: 0 });
          setSubtype("");
          break;
        }
      }
    }
  }, [type]);

  useEffect(() => {
    if (subtype !== undefined) {
      for (let j = 0; j < prompts[selected.type].sub.length; j++) {
        if (prompts[selected.type].sub[j].subtype == subtype) {
          setChat(prompts[selected.type].sub[j].chat);
          setHelpText(prompts[selected.type].sub[j].help);
          setSelected({ ...selected, subtype: j });
          break;
        }
      }
    }
  }, [subtype]);

  function sendRequest() {
    if (prompt === "") {
      setError("Can't be empty");
    } else {
      setError("");
      requestAssistant(prompt, subtype, checked, setPrompt, selected);
    }
  }

  function genImage() {
    if (prompt === "") {
      setError("Can't be empty");
    } else {
      setError("");
      requestImage(prompt, setPrompt, selected);
    }
  }

  return (
    <Container className={styles.form_section} shadows="md">
      <Container>
        <Select
          className={styles.select}
          label="Assistant type"
          placeholder="Assistant"
          searchable
          onSearchChange={setType}
          searchValue={type}
          nothingFound="No options"
          data={typeList}
          defaultValue={type}
        />
        <Select
          className={styles.select}
          label="Assistant type"
          placeholder=""
          searchable
          onSearchChange={setSubtype}
          searchValue={subtype}
          nothingFound="No options"
          data={subList}
          defaultValue={subtype}
        />
        {chat && (
          <Checkbox
            className={styles.checkbox}
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            label="Follow conversation"
          />
        )}
        <Textarea
          placeholder={helpText}
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
          {/*<Button*/}
          {/*  radius="md"*/}
          {/*  size="md"*/}
          {/*  disabled={processing}*/}
          {/*  //   disabled={true}*/}
          {/*  onClick={genImage}*/}
          {/*  className={styles.ask_button}*/}
          {/*>*/}
          {/*  {processing ? "Processing..." : "Image"}*/}
          {/*</Button>*/}
        </Center>
      </Container>
    </Container>
  );
}
