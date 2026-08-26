<script setup lang="ts">
export type AnswerVariant =
  | 'default'
  | 'correct'
  | 'incorrect'
  | 'correct-muted'
  | 'disabled';

defineProps<{
  text: string;
  variant: AnswerVariant;
}>();
defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    class="flex min-h-11 w-full items-center gap-3 rounded-card px-4 py-3.5 text-left text-sm leading-relaxed transition sm:text-base"
    :class="[
      variant === 'default' &&
        'cursor-pointer bg-surface text-text-primary hover:bg-surface-raised active:bg-surface-raised',
      variant === 'correct' && 'bg-correct/15 text-text-primary ring-1 ring-correct',
      variant === 'incorrect' && 'bg-incorrect/15 text-text-primary ring-1 ring-incorrect',
      variant === 'correct-muted' && 'bg-transparent text-text-primary ring-1 ring-correct/60',
      variant === 'disabled' && 'bg-surface/60 text-text-secondary',
    ]"
    :disabled="variant !== 'default'"
    @click="$emit('click')"
  >
    <span
      v-if="variant === 'correct' || variant === 'correct-muted'"
      aria-hidden="true"
      class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-correct text-[11px] font-bold text-bg"
    >
      &#10003;
    </span>
    <span
      v-else-if="variant === 'incorrect'"
      aria-hidden="true"
      class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-incorrect text-[11px] font-bold text-bg"
    >
      &#10005;
    </span>
    <span>{{ text }}</span>
  </button>
</template>
