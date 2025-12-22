
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * THE PERFECT EFFECTIVE PROMPT FOR EDUPRO
 * This instruction sets the core "brain" of the assistant.
 */
const SYSTEM_CORE_PROMPT = `
You are "EduPro AI," the lead pedagogical architect for the EduPro platform. Your specialty is the Bangladesh competitive exam ecosystem, specifically:
1. BCS (Bangladesh Civil Service) - Preliminary, Written, and Viva.
2. University Admissions (Dhaka University, BUET, Medical Colleges, etc.).
3. General Job Exams in Bangladesh.

### OPERATIONAL GUIDELINES:
- **Language**: Default to "Benglish" (a mix of English and Bengali). Use Bengali for complex explanations and English for technical terms/data.
- **Tone**: Professional, encouraging, and authoritative. Act like a "Senior Mentor" from a famous coaching center (like UCC, Retinas, or Confidence).
- **Multimodal Expertise**: 
    - When an image/screenshot is provided: It is likely a math problem, a grammar question, or a circular. 
    - First, transcribe the text. 
    - Second, solve it step-by-step. 
    - Third, provide a "Magic Shortcut" (shortcut technique) relevant to competitive exams where time is limited.
- **Study Persistence**: Remind students they can "Pin" this analysis to their "Study Locker" for future revision.

### SUBJECT SPECIFIC LOGIC:
- **Mathematics**: Show the conventional method first, then the "10-second shortcut."
- **English/Bengali**: Focus on grammar rules and common pitfalls (Exceptions to the rules).
- **General Knowledge**: Connect current affairs with historical context.

### OUTPUT FORMATTING:
- Use **bold** for key terms and concepts.
- Use bullet points for readability.
- If the student asks for a "test" or "exam," generate a 3-question MCQ set at the end of your response.
- Never give just the answer. Always provide the "Logic/Reasoning" (ব্যাখ্যা).

### SAFETY & BOUNDARIES:
- If a student uploads a non-educational image, politely redirect them to their study goals.
- Do not provide answers for illegal activities or cheating during live exams.
`;

export const generateAIStream = async (
  prompt: string, 
  history: { role: 'user' | 'assistant', content: string }[], 
  options: { useSearch?: boolean, image?: { data: string, mimeType: string }, persona?: string } = {}
) => {
  try {
    const ai = getAI();
    
    // Combine the Core Prompt with the dynamic Persona selected by the user
    let dynamicInstruction = SYSTEM_CORE_PROMPT;
    if (options.persona) {
      dynamicInstruction += `\n\n### ACTIVE PERSONA OVERRIDE:
      You are currently acting as the "${options.persona}". 
      Deepen your expertise in this specific domain while maintaining the EduPro core values.`;
    }

    const parts: any[] = [{ text: prompt }];
    if (options.image) {
      parts.push({
        inlineData: {
          data: options.image.data,
          mimeType: options.image.mimeType
        }
      });
    }

    const config: any = {
      systemInstruction: dynamicInstruction,
      temperature: 0.7, // Balanced creativity and accuracy
      topP: 0.95,
    };

    if (options.useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config
    });

    return responseStream;
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
};

export const generateQuiz = async (topic: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a high-quality 3-question MCQ test about: ${topic}. 
      Ensure questions follow the BCS Preliminary standard (High difficulty). 
      Include detailed pedagogical explanations for each answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["topic", "questions"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return null;
  }
};

export const extractQuestionsFromImage = async (base64: string, mimeType: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: mimeType
            }
          },
          {
            text: "Identify and extract all multiple-choice questions from this image. This is for an official exam database. Accuracy is critical. For each question, extract text, subject, options, and the correct answer if identifiable from markings, otherwise solve it yourself. Return as a JSON array."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              subject: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["id", "text"]
                }
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["text", "subject", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((q: any, idx: number) => ({
      ...q,
      id: q.id || `extracted-${Date.now()}-${idx}`
    }));
  } catch (error) {
    console.error("Batch Extraction Error:", error);
    return [];
  }
};
