<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from 'vue';
import type { Question, QuestionState } from '../../types/ticket';

const props = defineProps<{
  questions: Question[];
  questionStates: QuestionState[];
  currentIndex: number;
}>();

const emit = defineEmits<{ select: [index: number] }>();

const scroller = ref<HTMLElement | null>(null);
const trackWrap = ref<HTMLElement | null>(null);
const hasOverflow = ref(false);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const itemRefs: (HTMLLIElement | null)[] = [];
let resizeObserver: ResizeObserver | null = null;

function setItemRef(el: Element | ComponentPublicInstance | null, index: number) {
  itemRefs[index] = el as HTMLLIElement | null;
}

function updateScrollHints() {
  const el = scroller.value;
  if (!el) return;
  const maxScroll = el.scrollWidth - el.clientWidth;
  hasOverflow.value = maxScroll > 1;
  canScrollLeft.value = el.scrollLeft > 1;
  canScrollRight.value = el.scrollLeft < maxScroll - 1;
}

function scrollNav(direction: -1 | 1) {
  const el = scroller.value;
  if (!el) return;
  el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.75, 132), behavior: 'smooth' });
}

watch(
  () => props.currentIndex,
  (index) => {
    nextTick(() => {
      itemRefs[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      updateScrollHints();
    });
  },
);

onMounted(() => {
  nextTick(updateScrollHints);
  const wrap = trackWrap.value;
  if (!wrap || typeof ResizeObserver === 'undefined') return;
  resizeObserver = new ResizeObserver(() => updateScrollHints());
  resizeObserver.observe(wrap);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

function statusLabel(status: QuestionState['status']) {
  if (status === 'correct') return ', отвечено верно';
  if (status === 'incorrect') return ', отвечено неверно';
  return ', не отвечен';
}

function itemClasses(status: QuestionState['status'], isCurrent: boolean) {
  if (status === 'correct') {
    return isCurrent
      ? 'bg-correct text-white shadow-[0_2px_4px_rgba(0,0,0,0.18)]'
      : 'bg-white text-correct shadow-sm hover:bg-correct/5';
  }
  if (status === 'incorrect') {
    return isCurrent
      ? 'bg-incorrect text-white shadow-[0_2px_4px_rgba(0,0,0,0.18)]'
      : 'bg-white text-incorrect shadow-sm hover:bg-incorrect/5';
  }
  return isCurrent
    ? 'bg-accent text-text-on-accent shadow-[0_2px_4px_rgba(0,0,0,0.18)]'
    : 'bg-white text-text-primary shadow-sm hover:bg-accent/10';
}
</script>

<template>
  <div class="flex items-center gap-2 lg:block">
    <button
      v-show="hasOverflow"
      type="button"
      class="relative z-10 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white text-text-primary shadow-sm outline-none transition duration-200 ease-out hover:bg-accent/10 active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:cursor-default disabled:opacity-30 lg:hidden"
      :disabled="!canScrollLeft"
      aria-label="Предыдущие вопросы"
      @click="scrollNav(-1)"
    >
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div ref="trackWrap" class="relative min-w-0 flex-1 pr-8 lg:pr-0 lg:flex-none">
      <nav
        ref="scroller"
        aria-label="Навигация по вопросам билета"
        class="snap-x snap-proximity overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:w-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        @scroll.passive="updateScrollHints"
      >
        <ul class="flex w-max gap-2 py-2 lg:grid lg:w-fit lg:grid-cols-10 lg:justify-items-center lg:mx-auto lg:py-2">
          <li
            v-for="(q, index) in questions"
            :key="q.id"
            :ref="(el) => setItemRef(el, index)"
            class="snap-start"
          >
            <button
              type="button"
              class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-sm font-bold outline-none transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
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
    </div>
    <button
      v-show="hasOverflow"
      type="button"
      class="relative z-10 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white text-text-primary shadow-sm outline-none transition duration-200 ease-out hover:bg-accent/10 active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:cursor-default disabled:opacity-30 lg:hidden"
      :disabled="!canScrollRight"
      aria-label="Следующие вопросы"
      @click="scrollNav(1)"
    >
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>
