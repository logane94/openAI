import React, { useState } from 'react';
import axios from 'axios';

const OpenAIChat = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: input,
        max_tokens: 100,
      }, {
        headers: {
          'Authorization': `Bearer YOUR_API_KEY_HERE`
        }
      });
      setResponse(res.data.choices[0].text);
    } catch (error) {
      console.error('Error al llamar a la API de OpenAI:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Haz una pregunta..."
        />
        <button type="submit">Enviar</button>
      </form>
      <p>Respuesta: {response}</p>
    </div>
  );
};

export default OpenAIChat;
