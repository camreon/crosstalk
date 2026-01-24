export interface User {
  id: number;
  username: string;
  display_name: string | null;
  blog_url: string | null;
  created_at: string;
  response_count?: number;
  completed_topics?: { id: number; name: string }[];
}

export interface Topic {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  question_count?: number;
}

export interface Question {
  id: number;
  topic_id: number;
  text: string;
  question_type: 'likert' | 'multiple_choice' | 'yes_no';
  options: string[] | null;
  sort_order: number;
}

export interface TopicWithQuestions {
  topic: Topic;
  questions: Question[];
}

export interface Response {
  id: number;
  user_id: number;
  question_id: number;
  answer: string;
  updated_at: string;
}

export interface ResponseWithQuestion extends Response {
  question_text: string;
  question_type: string;
  topic_id: number;
  topic_name: string;
}

export interface TopicProgress {
  topic_id: number;
  total: number;
  answered: number;
  complete: boolean;
}

export interface SaveResponseInput {
  user_id: number;
  question_id: number;
  answer: string;
}

export interface CommonGroundAnalysis {
  summary: string;
  common_ground: string[];
  areas_of_nuance: string[];
  talking_points: string[];
  conversation_starters: string[];
}

export interface CompareResult {
  user1: User;
  user2: User;
  shared_questions: number;
  agreements?: SharedResponse[];
  disagreements?: SharedResponse[];
  ai_analysis?: CommonGroundAnalysis | null;
  message?: string;
}

export interface SharedResponse {
  question_id: number;
  question_text: string;
  topic_name: string;
  user1_answer: string;
  user2_answer: string;
}
