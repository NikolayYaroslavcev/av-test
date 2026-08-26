<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close');
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Transition name="paywall-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="relative w-full max-w-sm rounded-card bg-surface p-6 text-center shadow-2xl ring-1 ring-white/10 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
        aria-describedby="paywall-description"
      >
        <button
          type="button"
          class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-raised hover:text-text-primary"
          aria-label="Закрыть"
          @click="$emit('close')"
        >
          &#10005;
        </button>

        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
          <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke-linecap="round" />
          </svg>
        </div>

        <h2 id="paywall-title" class="mt-4 text-lg font-semibold text-text-primary">
          Откройте доступ к 3D-Видеоразбору
        </h2>
        <p id="paywall-description" class="mx-auto mt-2 max-w-[26ch] text-sm leading-relaxed text-text-secondary">
          Разбор этого вопроса доступен после разблокировки.
        </p>

        <button
          type="button"
          class="mt-6 min-h-11 w-full rounded-pill bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 active:brightness-95"
        >
          Разблокировать доступ
        </button>
        <button
          type="button"
          class="mt-2 min-h-11 w-full rounded-pill px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-surface-raised hover:text-text-primary"
          @click="$emit('close')"
        >
          Не сейчас
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.paywall-fade-enter-active,
.paywall-fade-leave-active {
  transition: opacity 0.2s ease;
}
.paywall-fade-enter-from,
.paywall-fade-leave-to {
  opacity: 0;
}
.paywall-fade-enter-active > div,
.paywall-fade-leave-active > div {
  transition:
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease;
}
.paywall-fade-enter-from > div,
.paywall-fade-leave-to > div {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
