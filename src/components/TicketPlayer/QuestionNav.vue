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

function statusClasses(status: QuestionState['status']) {
  if (status === 'correct') return 'bg-correct/15 text-correct ring-1 ring-inset ring-correct/40';
  if (status === 'incorrect') return 'bg-incorrect/15 text-incorrect ring-1 ring-inset ring-incorrect/40';
  return 'bg-surface text-text-secondary hover:bg-surface-raised';
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
          class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-sm font-semibold transition"
          :class="[
            statusClasses(questionStates[index].status),
            index === currentIndex && 'outline outline-2 outline-offset-1 outline-text-primary/70',
          ]"
          :aria-current="index === currentIndex ? 'true' : undefined"
          :aria-label="`Вопрос ${index + 1}${statusLabel(questionStates[index].status)}`"
          @click="emit('select', index)"
        >
          <span v-if="questionStates[index].status === 'correct'" aria-hidden="true">&#10003;</span>
          <span v-else-if="questionStates[index].status === 'incorrect'" aria-hidden="true">&#10005;</span>
          <span v-else>{{ index + 1 }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
