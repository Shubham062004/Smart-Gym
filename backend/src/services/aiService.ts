import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export const generateChatResponse = async (message: string) => {
  const prompt = `You are an AI Fitness Coach for OnlyFitness. Respond to the user's message: "${message}". 
  If they ask for a workout plan, return it in a structured JSON format like this:
  {
    "type": "workout_plan",
    "plan": [
      {"exercise": "Pushups", "sets": 3, "reps": 15},
      ...
    ]
  }
  Otherwise, just provide a helpful, encouraging fitness tip or answer.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const generateDietPlanBody = async (userData: any) => {
  const { age, weight, height, goal, preference } = userData;
  const prompt = `Generate a personalized daily diet plan for a user:
  Age: ${age}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}, Preference: ${preference}.
  Return ONLY a structured JSON object:
  {
    "macros": {"calories": 1800, "protein": 150, "carbs": 200, "fats": 60},
    "breakfast": {"meal": "...", "protein": 20},
    "lunch": {"meal": "...", "protein": 30},
    "dinner": {"meal": "...", "protein": 35},
    "snacks": {"meal": "...", "protein": 10}
  }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
