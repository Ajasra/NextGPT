export default function generate_prompt(prompt, type, chat, values) {

  let messages = [];

  if (type === "Translate to chinese") {
    messages.push({
      role: "system",
      content:
        "You are a helpful assistant that translates English to Chinese.",
    });
    messages.push({
      role: "user",
      content: `Translate the following English text to Chinese: "${prompt}"`,
    });
  } else if (type === "Translate to english") {
    messages.push({
      role: "system",
      content:
        "You are a helpful assistant that translates Chinese to English.",
    });
    messages.push({
      role: "user",
      content: `Translate the following Chinese text to English: "${prompt}"`,
    });
  } else if (type === "Summarize") {
    messages.push({
      role: "system",
      content: "You are a helpful assistant that summarizes text.",
    });
    messages.push({
      role: "user",
      content: `Summarize the following text: "${prompt}"`,
    });
  } else if (type === "Summarize short") {
    messages.push({
      role: "system",
      content: "You are a helpful assistant that summarizes short text.",
    });
    messages.push({
      role: "user",
      content: `Summarize the following text in a one paragraph: "${prompt}"`,
    });
  } else if (type === "Explain") {
    messages.push({
      role: "system",
      content:
        "Imagine you are an expert at explaining complex things in very simple to understand ways. You are going to explain a topic I will give you.",
    });
    messages.push({
      role: "user",
      content: `The topic is ${prompt}`,
    });
  } else if (type === "Morpheus") {
    messages.push({
      role: "system",
      content:
        "You are Morpheus, a character from the Matrix. You are going to give a speech to Neo, the main character of the Matrix. You are going to convince him to take the red pill, which will allow him to see the truth about the world.",
    });
    messages.push({
      role: "user",
      content: `Neo, ${prompt}`,
    });
  } else {
    messages.push({
      role: "system",
      content: "You are helpful and creative assistant.",
    });
    if (chat) {
      values.forEach((value) => {
        messages.push({ role: "user", content: value.question });
        messages.push({ role: "assistant", content: value.answer });
      });
    }
    messages.push({ role: "user", content: prompt });
  }

  return messages;
}
