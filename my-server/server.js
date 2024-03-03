require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const openaiApiKey = process.env.OPENAI_API_KEY;

app.post("/get-recommendations", async (req, res) => {
  const { imc, imcCategory, goal, exerciseDays, gymPreference } = req.body;

  const prompt = `
    Basado en un IMC de ${imc} (${imcCategory}), 
    y queriendo ${goal} con ${exerciseDays} días de ejercicio a la semana 
    ${gymPreference ? "yendo al gimnasio" : "sin ir al gimnasio"}, 
    ¿cuáles son las recomendaciones de ejercicio para alcanzar este objetivo?
  `;

  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-4",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    res.json(openaiResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
