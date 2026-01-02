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