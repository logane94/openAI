// ExercisePlanner.js
import React, { useState } from "react";
import axios from "axios";

function ExercisePlanner() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [exerciseDays, setExerciseDays] = useState("");
  const [gymPreference, setGymPreference] = useState(false);
  const [goal, setGoal] = useState("");
  const [imc, setImc] = useState(null);
  const [imcCategory, setImcCategory] = useState("");
  const [recommendations, setRecommendations] = useState({
    lose: [],
    maintain: [],
    gain: [],
  });

  const calculateIMC = () => {
    const heightInMeters = height / 100; // convert cm to meters
    const imcValue = weight / (heightInMeters * heightInMeters);
    setImc(imcValue.toFixed(2));
    categorizeIMC(imcValue);
  };

  const categorizeIMC = (imcValue) => {
    if (imcValue < 18.5) setImcCategory("Underweight");
    else if (imcValue >= 18.5 && imcValue <= 24.9)
      setImcCategory("Normal weight");
    else if (imcValue >= 25 && imcValue <= 29.9) setImcCategory("Overweight");
    else setImcCategory("Obesity");
  };

  const fetchRecommendations = async () => {
    const prompt = `
    Basado en un IMC de ${imc} (${imcCategory}), 
    y queriendo ${goal} con ${exerciseDays} días de ejercicio a la semana 
    ${gymPreference ? "yendo al gimnasio" : "sin ir al gimnasio"}, 
    ¿cuáles son las recomendaciones de ejercicio para alcanzar este objetivo?
  `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "gpt-4", // Asegúrate de usar el modelo más reciente disponible.
          prompt: prompt,
          temperature: 0.5,
          max_tokens: 1024,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );

      const textResponse = response.data.choices[0].text.trim();
      const recommendations = textResponse.split("\n");
      setRecommendations(recommendations);

      console.log("Recommendations from OpenAI:", recommendations);
    } catch (error) {
      console.error("Error fetching recommendations from OpenAI:", error);
    }
    const simulatedResponse = {
      lose: ["Cardio 30 mins", "Strength training 20 mins", "Yoga 10 mins"],
      maintain: ["Mixed cardio 20 mins", "Body weight exercises 20 mins"],
      gain: [
        "Heavy lifting 30 mins",
        "Protein intake consultation",
        "Rest days: 2",
      ],
    };

    setRecommendations(simulatedResponse);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateIMC();
    fetchRecommendations();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (kg)"
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height (cm)"
        />
        <input
          type="number"
          value={exerciseDays}
          onChange={(e) => setExerciseDays(e.target.value)}
          placeholder="Days of exercise"
        />
        <label>
          <input
            type="checkbox"
            checked={gymPreference}
            onChange={(e) => setGymPreference(e.target.checked)}
          />
          Will go to the gym
        </label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option value="">Select your goal</option>
          <option value="lose">Lose weight</option>
          <option value="maintain">Maintain weight</option>
          <option value="gain">Gain weight</option>
        </select>
        <button type="submit">Get Recommendations</button>
      </form>

      {imc && (
        <div>
          <p>
            Your IMC is {imc} ({imcCategory})
          </p>
          <h3>Recommendations:</h3>
          <div>
            {goal === "lose" &&
              recommendations.lose.map((r, index) => <p key={index}>{r}</p>)}
            {goal === "maintain" &&
              recommendations.maintain.map((r, index) => (
                <p key={index}>{r}</p>
              ))}
            {goal === "gain" &&
              recommendations.gain.map((r, index) => <p key={index}>{r}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExercisePlanner;
