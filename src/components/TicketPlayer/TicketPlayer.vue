<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Question, QuestionState } from '../../types/ticket';
import FavoriteButton from './FavoriteButton.vue';
import MediaBlock from './MediaBlock.vue';
import PaywallModal from './PaywallModal.vue';
import QuestionContent from './QuestionContent.vue';
import QuestionNav from './QuestionNav.vue';

const props = defineProps<{ questions: Question[] }>();

const currentIndex = ref(0);
const questionStates = reactive<QuestionState[]>(
  props.questions.map(() => ({
    status: 'unanswered',
    selectedAnswerIndex: null,
    isFavorite: false,
  })),
);
const isPaywallOpen = ref(false);

const currentQuestion = computed(() => props.questions[currentIndex.value]);
const currentState = computed(() => questionStates[currentIndex.value]);

function goToQuestion(index: number) {
  currentIndex.value = index;
}

function selectAnswer(answerIndex: number) {
  const state = questionStates[currentIndex.value];
  if (state.status !== 'unanswered') return;
  const answer = currentQuestion.value.answers[answerIndex];
  state.selectedAnswerIndex = answerIndex;
  state.status = answer.is_correct ? 'correct' : 'incorrect';
}

function toggleFavorite() {
  questionStates[currentIndex.value].isFavorite = !questionStates[currentIndex.value].isFavorite;
}

function openPaywall() {
  isPaywallOpen.value = true;
  document.body.classList.add('modal-open');
}

function closePaywall() {
  isPaywallOpen.value = false;
  document.body.classList.remove('modal-open');
}
</script>

<template>
  <div class="min-h-screen bg-bg text-text-primary">
    <div class="mx-auto w-full max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-12">
      <header class="mb-4 flex items-center justify-between sm:mb-6">
        <button
          type="button"
          class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill bg-surface transition hover:bg-surface-raised"
          aria-label="Назад"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <h1 class="text-base font-semibold sm:text-lg">{{ currentQuestion.ticket_number }}</h1>
        <div class="h-11 w-11" aria-hidden="true" />
      </header>

      <QuestionNav
        :questions="questions"
        :question-states="questionStates"
        :current-index="currentIndex"
        @select="goToQuestion"
      />

      <main class="mt-4 sm:mt-6 lg:grid lg:grid-cols-[minmax(320px,420px)_1fr] lg:items-start lg:gap-8">
        <div class="lg:sticky lg:top-6">
          <MediaBlock :image="currentQuestion.image" @open-paywall="openPaywall" />
        </div>

        <div class="mt-5 lg:mt-0">
          <QuestionContent
            :question="currentQuestion"
            :state="currentState"
            @select-answer="selectAnswer"
          />

          <div class="mt-5 flex flex-wrap items-center justify-between gap-4">
            <FavoriteButton :is-favorite="currentState.isFavorite" @toggle="toggleFavorite" />
          </div>

          <p
            v-if="currentState.status !== 'unanswered'"
            class="mt-4 rounded-card border-l-4 border-accent bg-surface p-4 text-sm leading-relaxed text-text-secondary"
          >
            {{ currentQuestion.answer_tip }}
          </p>
        </div>
      </main>
    </div>

    <PaywallModal :open="isPaywallOpen" @close="closePaywall" />
  </div>
</template>
