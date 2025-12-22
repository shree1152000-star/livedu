
export type View = 'chat' | 'mcq' | 'teachers' | 'lectures' | 'leaderboard' | 'teacher_profile' | 'exam_result' | 'exam_review' | 'exam_history' | 'admin' | 'locker';
export type UserRole = 'student' | 'teacher' | 'admin' | 'collaborator';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quiz?: QuickQuiz; // Optional quiz data for integrated exams
}

export interface QuickQuiz {
  topic: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  institution: string;
  experience: string;
  rating: number;
  reviewCount: number;
  status: 'online' | 'offline';
  image: string;
  hourlyRate?: string;
  about?: string;
}

export interface Question {
  id: string;
  text: string;
  subject: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export interface AdminDocument {
  id: string;
  title: string;
  subject: string;
  topic: string;
  uploadDate: string;
  fileSize: string;
  type: 'PDF' | 'DOC' | 'IMG';
}

export interface StudentAsset {
  id: string;
  title: string;
  type: 'IMAGE' | 'PDF' | 'NOTE';
  data: string; // base64 or text
  mimeType?: string;
  date: string;
  subject?: string;
  aiAnalysis?: string;
}

export interface Exam {
  id: string;
  title: string;
  totalMarks: number;
  duration: number;
  subject: string;
  topic: string;
}

export interface Lecture {
  id: string;
  title: string;
  duration: string;
}
