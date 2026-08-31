<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTicketStore } from '../../stores/ticketStore';
import type { Question } from '../../types/ticket';
import logo from '../../assets/logo.png';
import FavoriteButton from './FavoriteButton.vue';
import MediaBlock from './MediaBlock.vue';
import PaywallModal from './PaywallModal.vue';
import QuestionContent from './QuestionContent.vue';
import QuestionNav from './QuestionNav.vue';

const props = defineProps<{ ticketId: string; questions: Question[] }>();

const store = useTicketStore();
store.initTicket(props.ticketId, props.questions);

const isPaywallOpen = ref(false);

const currentIndex = computed(() => store.progress[props.ticketId].currentIndex);
const questionStates = computed(() => store.progress[props.ticketId].questionStates);
const currentQuestion = computed(() => props.questions[currentIndex.value]);
const currentState = computed(() => questionStates.value[currentIndex.value]);

function goToQuestion(index: number) {
  store.goToQuestion(props.ticketId, index);
}

function selectAnswer(answerIndex: number) {
  const answer = currentQuestion.value.answers[answerIndex];
  store.selectAnswer(props.ticketId, answerIndex, answer.is_correct);
}

function toggleFavorite() {
  store.toggleFavorite(props.ticketId);
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
          class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill bg-accent text-text-on-accent outline-none transition duration-200 ease-out hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          aria-label="Назад"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <h1 class="text-base font-semibold sm:text-lg">{{ currentQuestion.ticket_number }}</h1>
        <img
          :src="logo"
          alt="Третий Рим"
          class="h-16 w-16 shrink-0 rounded-xl object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
        />
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
            class="mt-4 rounded-card border border-border bg-accent/10 p-4 text-sm leading-relaxed text-text-primary"
          >
            {{ currentQuestion.answer_tip }}
          </p>
        </div>
      </main>
    </div>

    <PaywallModal :open="isPaywallOpen" @close="closePaywall" />
  </div>
</template>
