<script setup lang="ts">
import type { Question, QuestionState } from '../../types/ticket';
import AnswerButton, { type AnswerVariant } from './AnswerButton.vue';

const props = defineProps<{ question: Question; state: QuestionState }>();
const emit = defineEmits<{ 'select-answer': [index: number] }>();

function variantFor(index: number): AnswerVariant {
  const { status, selectedAnswerIndex } = props.state;
  if (status === 'unanswered') return 'default';
  if (index === selectedAnswerIndex) return status === 'correct' ? 'correct' : 'incorrect';
  if (status === 'incorrect' && props.question.answers[index].is_correct) return 'correct-muted';
  return 'disabled';
}
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold leading-snug sm:text-xl">{{ question.question }}</h2>

    <ul class="mt-4 flex flex-col gap-3">
      <li v-for="(answer, index) in question.answers" :key="index">
        <AnswerButton
          :text="answer.answer_text"
          :variant="variantFor(index)"
          @click="emit('select-answer', index)"
        />
      </li>
    </ul>
  </div>
</template>
