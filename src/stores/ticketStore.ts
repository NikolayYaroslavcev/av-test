import { defineStore } from 'pinia';
import { reactive } from 'vue';
import type { Question, TicketProgress } from '../types/ticket';

export const useTicketStore = defineStore('ticket', () => {
  const progress = reactive<Record<string, TicketProgress>>({});

  function initTicket(ticketId: string, questions: Question[]) {
    if (progress[ticketId]) return;
    progress[ticketId] = {
      currentIndex: 0,
      questionStates: questions.map(() => ({
        status: 'unanswered',
        selectedAnswerIndex: null,
        isFavorite: false,
      })),
    };
  }

  function goToQuestion(ticketId: string, index: number) {
    progress[ticketId].currentIndex = index;
  }

  function selectAnswer(ticketId: string, answerIndex: number, isCorrect: boolean) {
    const state = progress[ticketId].questionStates[progress[ticketId].currentIndex];
    if (state.status !== 'unanswered') return;
    state.selectedAnswerIndex = answerIndex;
    state.status = isCorrect ? 'correct' : 'incorrect';
  }

  function toggleFavorite(ticketId: string) {
    const state = progress[ticketId].questionStates[progress[ticketId].currentIndex];
    state.isFavorite = !state.isFavorite;
  }

  function getTicketStats(ticketId: string) {
    const ticket = progress[ticketId];
    if (!ticket) return { total: 0, answered: 0, correct: 0, favorites: 0 };
    const states = ticket.questionStates;
    return {
      total: states.length,
      answered: states.filter((s) => s.status !== 'unanswered').length,
      correct: states.filter((s) => s.status === 'correct').length,
      favorites: states.filter((s) => s.isFavorite).length,
    };
  }

  return { progress, initTicket, goToQuestion, selectAnswer, toggleFavorite, getTicketStats };
});
