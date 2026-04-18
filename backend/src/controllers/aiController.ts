import { Request, Response } from 'express';
import { generateChatResponse, generateDietPlanBody } from '../services/aiService';

export const handleAIChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const aiResponse = await generateChatResponse(message);
    
    let workoutPlan = [];
    let dietPlan = [];
    let finalMessage = aiResponse;

    // Try to extract structured data from AI response if present
    try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.type === 'workout_plan') workoutPlan = parsed.plan || [];
            if (parsed.type === 'diet_plan') dietPlan = parsed.plan || [];
            
            // Remove the JSON block from the readable message
            finalMessage = aiResponse.replace(jsonMatch[0], '').trim();
        }
    } catch (e) {
        // Just send as text if parsing fails
    }

    res.status(200).json({ 
        success: true, 
        message: finalMessage || "Here is your plan:", 
        workoutPlan, 
        dietPlan 
    });
  } catch (error: any) {
    console.error('[AI Chat Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

export const handleGenerateDiet = async (req: Request, res: Response) => {
  try {
    const dietResponse = await generateDietPlanBody(req.body);
    const jsonMatch = dietResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ success: true, diet: parsed });
    }
    res.status(200).json({ success: true, raw: dietResponse });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
