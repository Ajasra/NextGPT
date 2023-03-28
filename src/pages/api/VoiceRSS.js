const axios = require("axios");

const apiKey = process.env.NEXT_PUBLIC_VOICE_RSS;
const LOCAL_KEY = process.env.NEXT_PUBLIC_LOCAL_KEY;

export default async function handler(req, res) {
	if (req.method === "POST") {
		
		const rand = Math.floor(Math.random() * 100);
		const filename = `public/resp/response_${rand}.mp3`;
		
		let message = req.body.messages;
		let key = req.body.key;
		
		console.log(message);
		
		if (key !== LOCAL_KEY) {
			res.status(404).json({ error: "Access denied" });
			return;
		}
		
		if (message.length == 0) {
			res.status(404).json({ error: "Empty message" });
			return;
		}
		
		try {
			
			let config = {
				method: 'post',
				maxBodyLength: Infinity,
				url: `http://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${message}&r=-2`,
				headers: { }
			};
			
			console.log(config);
			
			await axios
				.request(config)
				.then((response) => {
					const answer = response.data;
					// console.log(answer);
					res.status(200).json({ error: null, answer: answer });
				})
				.catch((error) => {
					res.status(500).json({ error: error });
				});
			
		} catch (error) {
			console.error(
				`An error occurred while converting text to speech: ${error}`
			);
		}
	} else {
		res.status(404).json({ error: "Not found" });
	}
}
