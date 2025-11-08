import { GoogleGenAI, Type } from "@google/genai";
import type { LessonPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lessonPlanSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        theme: {
            type: Type.OBJECT,
            properties: {
                pointName: { type: Type.STRING },
                titles: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            threshold: { type: Type.NUMBER },
                            name: { type: Type.STRING }
                        },
                        required: ['threshold', 'name']
                    }
                },
                colorScheme: {
                    type: Type.OBJECT,
                    properties: {
                        primary: { type: Type.STRING },
                        secondary: { type: Type.STRING },
                        accent: { type: Type.STRING },
                        background: { type: Type.STRING },
                        text: { type: Type.STRING },
                    },
                    required: ['primary', 'secondary', 'accent', 'background', 'text']
                },
                fonts: {
                    type: Type.OBJECT,
                    properties: {
                        display: { type: Type.STRING },
                        body: { type: Type.STRING }
                    },
                    required: ['display', 'body']
                }
            },
            required: ['pointName', 'titles', 'colorScheme', 'fonts']
        },
        chronology: {
            type: Type.OBJECT,
            properties: {
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            text: { type: Type.STRING }
                        },
                        required: ['id', 'text']
                    }
                }
            },
            required: ['items']
        },
        quiz: {
            type: Type.OBJECT,
            properties: {
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING }
                        },
                        required: ['question', 'options', 'correctAnswer']
                    }
                }
            },
            required: ['questions']
        },
        fastestFinger: {
            type: Type.OBJECT,
            properties: {
                concepts: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            name: { type: Type.STRING },
                            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['id', 'name', 'keywords']
                    }
                }
            },
            required: ['concepts']
        },
        infoSlides: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    paragraphs: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['title', 'paragraphs']
            }
        }
    },
    required: ['topic', 'theme', 'chronology', 'quiz', 'fastestFinger', 'infoSlides']
};


export const generateLessonPlan = async (topic: string, content: string, gradeLevel: string): Promise<LessonPlan> => {
    const prompt = `
      You are an expert instructional designer creating an interactive, game-based learning module. Based on the provided topic, content, and target grade level, generate a complete lesson plan in a single JSON object.

      **Topic:** "${topic}"
      **Grade Level:** "${gradeLevel}"
      **Content:**
      ---
      ${content}
      ---

      **Instructions:**
      1.  **Analyze the Content:** Read the content thoroughly. Your entire output must be based *strictly* on this content. Do not add external information.
      2.  **Thematic Elements:**
          *   \`theme.pointName\`: Create a creative, single-word name for points/currency that fits the topic (e.g., "Rupaiya" for Mughals, "Denarius" for Romans).
          *   \`theme.titles\`: Generate an array of 5 thematic titles for ranks, from lowest to highest. Each object must have \`threshold\` (0, 1000, 2000, 3000, 4000) and \`name\`.
          *   \`theme.colorScheme\`: Suggest a WCAG-compliant color scheme with hex codes for \`primary\`, \`secondary\`, \`accent\`, \`background\`, and \`text\`. The background should be dark.
          *   \`theme.fonts\`: Suggest a pair of Google Fonts: one for \`display\` (headings) and one for \`body\` text.
      3.  **Chronology Activity:**
          *   Extract 5-7 key sequential events from the content. Return this as an ordered array in \`chronology.items\`.
      4.  **Quiz Activity:**
          *   Based on content length, generate 3-5 multiple-choice questions for \`quiz.questions\`.
          *   The language must be appropriate for the specified grade level.
          *   Provide 4 options for each question. **Critically, vary the length of correct and incorrect options to avoid bias.**
          *   The \`correctAnswer\` must exactly match one of the options.
      5.  **Fastest Finger First Activity:**
          *   Identify 4-6 core concepts (people, ideas, etc.). For each, list 4-5 relevant keywords. Return this in \`fastestFinger.concepts\`.
      6.  **Info Slides:**
          *   Generate two simple info slides (\`infoSlides\`) to introduce the Chronology and Quiz activities. Each needs a \`title\` and \`paragraphs\`.

      The entire output must be a single, valid JSON object conforming to the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: lessonPlanSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const plan = JSON.parse(jsonText);
        
        if (!plan.topic || !plan.theme || !plan.quiz?.questions?.length) {
            throw new Error("Generated content is not a valid lesson plan.");
        }

        return plan as LessonPlan;
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        throw new Error("Failed to generate the lesson plan. The AI may be busy, or the content may be too short. Please try again.");
    }
};
