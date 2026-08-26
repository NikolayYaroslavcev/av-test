export interface Answer {
  answer_text: string;
  is_correct: boolean;
}

export interface Question {
  title: string; // "Вопрос 1"
  ticket_number: string; // "Билет 1"
  ticket_category: string; // "A,B"
  image: string; // "./images/no_image.jpg"
  question: string;
  answers: Answer[]; // 3-4 варианта, ровно один is_correct: true
  correct_answer: string; // "Правильный ответ: 2" — только для отображения, не парсить
  answer_tip: string; // пояснение, показывать после ответа
  topic: string[];
  id: string;
}

export type Ticket = Question[];

export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export interface QuestionState {
  status: AnswerStatus;
  selectedAnswerIndex: number | null;
  isFavorite: boolean;
}

export interface PlayerState {
  questions: Question[];
  currentIndex: number;
  questionStates: QuestionState[];
  isPaywallOpen: boolean;
}
