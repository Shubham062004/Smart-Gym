import { Request, Response } from 'express';
import { generateChatResponse, generateDietPlanBody } from '../services/aiService';

export const handleAIChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const aiResponse = await generateChatResponse(message);
    
    // Try to parse JSON if it looks like JSON
    try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.status(200).json({ success: true, response: parsed, isStructured: true });
        }
    } catch (e) {
        // Fallback to text
    }

    res.status(200).json({ success: true, response: aiResponse, isStructured: false });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
