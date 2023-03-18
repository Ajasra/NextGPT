const axios = require('axios');

const OPENAI_API_KEY = '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';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export default function handler(req, res) {
	
	if (req.method === 'POST') {
		console.log(req.body);
		res.status(200).json({ name: 'John Doe' })
	}else {
		res.status(404).json({ error: 'Not found' })
	}
}
