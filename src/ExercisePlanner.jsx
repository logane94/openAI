// ExercisePlanner.js
import React, { useState } from "react";
import OpenAI from "openai";
import "./ExercisePlanner.css";

function ExercisePlanner() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [exerciseDays, setExerciseDays] = useState("");
  const [gymPreference, setGymPreference] = useState(false);
  const [goal, setGoal] = useState("");
  const [imc, setImc] = useState(null);
  const [imcCategory, setImcCategory] = useState("");
  const [recommendations, setRecommendations] = useState("");

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
    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });
    const prompt = `
      Based on an IMC of ${imc} (${imcCategory}), 
      and wanting to ${goal} with ${exerciseDays} days of exercise a week 
      ${gymPreference ? "going to the gym" : "without going to the gym"}, 
      what are the exercise recommendations to achieve this goal? En español, pero quiero un plan de ejercicios dia a dia.
    `;

    try {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      let fullResponseText = response.choices[0].message.content;

      fullResponseText = fullResponseText.replace(/¡\s*/g, "<br/><br/>¡");

      const dailyRecommendationsJSX = fullResponseText
        .split(/Día \d+: /)
        .slice(1)
        .map((dayPlan, index) => {
          const dayParts = dayPlan
            .split("<br/><br/>")
            .map((part, partIndex) => (
              <React.Fragment key={partIndex}>
                {partIndex > 0 && <br />} {part.trim()}
              </React.Fragment>
            ));

          return (
            <div key={index}>
              <strong>{`Día ${index + 1}`}</strong>: {dayParts}
            </div>
          );
        });

      setRecommendations(<>{dailyRecommendationsJSX}</>);
    } catch (error) {
      console.error("Error:", error);
    }
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
          <div className="recommendations-container">{recommendations}</div>
        </div>
      )}
    </div>
  );
}

export default ExercisePlanner;
