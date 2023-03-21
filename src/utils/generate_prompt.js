export default function generate_prompt(prompt, chat, values, selected, prompts) {

  let messages = [];
  
  messages.push({
        role: "system",
        content:
            prompts[selected.type].sub[selected.subtype].system,
      });

  if (chat) {
    values.forEach((value) => {
      if (value.type != "error") {
        messages.push({ role: "user", content: value.question });
        messages.push({ role: "assistant", content: value.answer });
      }
    });
  }
  
  messages.push({
        role: "user",
        content: prompts[selected.type].sub[selected.subtype].prompt.replace("userprompt", prompt),
      });

  return messages;
}
