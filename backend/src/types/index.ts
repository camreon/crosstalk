export interface User {
  id: number;
  username: string;
  display_name: string | null;
  blog_url: string | null;
  created_at: string;
}

export interface Topic {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface Question {
  id: number;
  topic_id: number;
  text: string;
  question_type: 'likert' | 'multiple_choice' | 'yes_no';
  options: string | null;
  sort_order: number;
}

export interface QuestionWithParsedOptions extends Omit<Question, 'options'> {
  options: string[] | null;
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

export interface CreateUserInput {
  username: string;
  display_name?: string;
  blog_url?: string;
}

export interface UpdateUserInput {
  display_name?: string;
  blog_url?: string;
}

export interface SaveResponseInput {
  user_id: number;
  question_id: number;
  answer: string;
}

export interface CompareResult {
  user1: User;
  user2: User;
  agreements: {
    topic: string;
    questions: {
      question: string;
      user1_answer: string;
      user2_answer: string;
    }[];
  }[];
  disagreements: {
    topic: string;
    questions: {
      question: string;
      user1_answer: string;
      user2_answer: string;
    }[];
  }[];
  commonGround: string;
  talkingPoints: string[];
}
