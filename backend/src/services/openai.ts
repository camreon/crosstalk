import OpenAI from 'openai';
import type { User } from '../types/index.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface SharedResponse {
  question_id: number;
  question_text: string;
  topic_name: string;
  user1_answer: string;
  user2_answer: string;
}

export interface CommonGroundAnalysis {
  summary: string;
  common_ground: string[];
  areas_of_nuance: string[];
  talking_points: string[];
  conversation_starters: string[];
}

export async function findCommonGround(
  user1: User,
  user2: User,
  sharedResponses: SharedResponse[]
): Promise<CommonGroundAnalysis | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not configured, skipping analysis');
    return null;
  }

  // Group responses by topic
  const byTopic = new Map<string, SharedResponse[]>();
  for (const sr of sharedResponses) {
    if (!byTopic.has(sr.topic_name)) {
      byTopic.set(sr.topic_name, []);
    }
    byTopic.get(sr.topic_name)!.push(sr);
  }

  // Format for the prompt
  const formattedResponses = Array.from(byTopic.entries())
    .map(([topic, responses]) => {
      const questionComparisons = responses.map(r => 
        `  Q: ${r.question_text}\n  ${user1.display_name || user1.username}: ${r.user1_answer}\n  ${user2.display_name || user2.username}: ${r.user2_answer}`
      ).join('\n\n');
      return `## ${topic}\n${questionComparisons}`;
    })
    .join('\n\n');

  const prompt = `You are a facilitator helping two people with different political views find common ground for a constructive conversation.

Here are the survey responses from two users:

User 1: ${user1.display_name || user1.username}
User 2: ${user2.display_name || user2.username}

${formattedResponses}

Analyze their responses and provide:

1. A brief summary (2-3 sentences) of where these two users stand relative to each other politically
2. Areas of common ground - specific topics or positions where they agree
3. Areas of nuance - where their positions are close or have shared underlying values despite different conclusions  
4. Talking points - constructive ways they could discuss their disagreements
5. Conversation starters - specific questions they could ask each other to understand perspectives better

Respond in JSON format:
{
  "summary": "...",
  "common_ground": ["...", "..."],
  "areas_of_nuance": ["...", "..."],
  "talking_points": ["...", "..."],
  "conversation_starters": ["...", "..."]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a thoughtful facilitator who helps people with different political views find common ground. You are balanced, non-partisan, and focused on constructive dialogue. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    // Parse the JSON response
    const analysis = JSON.parse(content) as CommonGroundAnalysis;
    return analysis;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}
