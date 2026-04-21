import { config } from 'dotenv';
import { generateChatResponse } from './src/services/aiService';

config();

async function test() {
    try {
        console.log("Testing AI...");
        const response = await generateChatResponse("Hello!");
        console.log("Response:", response);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
