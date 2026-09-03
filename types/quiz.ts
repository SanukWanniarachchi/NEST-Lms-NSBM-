export interface QuizSource {
  id: string;
  title: string;
  publisher: string;
  href: string;
  section: string;
  reviewedOn: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  source: QuizSource;
}

export interface ModuleQuiz {
  id: string;
  courseSlug: string;
  moduleId: string;
  title: string;
  introduction: string;
  passingScore: number;
  questions: QuizQuestion[];
}
