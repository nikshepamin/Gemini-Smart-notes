export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIActionResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export type AIActionType = 'summarize' | 'improve' | 'fix_grammar' | 'generate_title';
