import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";

export default function generate_prompt(prompt, chat, values, selected, prompts) {

  let messages = [];
  
  if (selected.type == 0 && selected.subtype == 1){
      // for random assistant it will pick up random character
      const type = 2;
      const subtype = randomInt(0, prompts[type].sub.length-1);
      console.log(type, subtype);
      messages.push({
          role: "system",
          content:
          prompts[type].sub[subtype].system,
      });
  }else{
      messages.push({
          role: "system",
          content:
          prompts[selected.type].sub[selected.subtype].system,
      });
  }

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
  
  console.log(messages);

  return messages;
}
