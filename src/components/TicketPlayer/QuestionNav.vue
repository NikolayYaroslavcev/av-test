<script setup lang="ts">
import { nextTick, watch, type ComponentPublicInstance } from 'vue';
import type { Question, QuestionState } from '../../types/ticket';

const props = defineProps<{
  questions: Question[];
  questionStates: QuestionState[];
  currentIndex: number;
}>();

const emit = defineEmits<{ select: [index: number] }>();

const itemRefs: (HTMLLIElement | null)[] = [];

function setItemRef(el: Element | ComponentPublicInstance | null, index: number) {
  itemRefs[index] = el as HTMLLIElement | null;
}

watch(
  () => props.currentIndex,
  (index) => {
    nextTick(() => {
      itemRefs[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  },
);

function statusLabel(status: QuestionState['status']) {
  if (status === 'correct') return ', отвечено верно';
  if (status === 'incorrect') return ', отвечено неверно';
  return ', не отвечен';
}

function itemClasses(status: QuestionState['status'], isCurrent: boolean) {
  if (status === 'correct') {
    return isCurrent
      ? 'border-correct bg-correct text-white shadow-[0_2px_4px_rgba(0,0,0,0.18)]'
      : 'border-correct bg-white text-correct hover:bg-correct/5';
  }
  if (status === 'incorrect') {
    return isCurrent
      ? 'border-incorrect bg-incorrect text-white shadow-[0_2px_4px_rgba(0,0,0,0.18)]'
      : 'border-incorrect bg-white text-incorrect hover:bg-incorrect/5';
  }
  return isCurrent
    ? 'border-text-primary bg-accent text-text-on-accent shadow-[0_2px_4px_rgba(0,0,0,0.18)]'
    : 'border-accent bg-white text-text-primary shadow-sm hover:bg-accent/10';
}
</script>

<template>
  <nav
    aria-label="Навигация по вопросам билета"
    class="-mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-1 pt-1 scroll-pl-4 scroll-pr-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
  >
    <ul class="flex w-max gap-2 lg:grid lg:w-fit lg:grid-cols-10 lg:justify-items-center lg:mx-auto">
      <li
        v-for="(q, index) in questions"
        :key="q.id"
        :ref="(el) => setItemRef(el, index)"
        class="snap-start"
      >
        <button
          type="button"
          class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border text-sm font-bold outline-none transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          :class="itemClasses(questionStates[index].status, index === currentIndex)"
          :aria-current="index === currentIndex ? 'true' : undefined"
          :aria-label="`Вопрос ${index + 1}${statusLabel(questionStates[index].status)}`"
          @click="emit('select', index)"
        >
          <svg
            v-if="questionStates[index].status === 'correct'"
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg
            v-else-if="questionStates[index].status === 'incorrect'"
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
