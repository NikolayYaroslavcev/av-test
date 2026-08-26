<script setup lang="ts">
defineProps<{ isFavorite: boolean }>();
defineEmits<{ toggle: [] }>();
</script>

<template>
  <button
    type="button"
    class="flex min-h-11 items-center gap-2 rounded-pill px-3 py-2 text-sm font-medium transition"
    :class="isFavorite ? 'text-accent' : 'text-accent/80 hover:text-accent'"
    :aria-pressed="isFavorite"
    @click="$emit('toggle')"
  >
    <svg
      viewBox="0 0 24 24"
      class="h-5 w-5"
      :fill="isFavorite ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="1.8"
    >
      <path
        d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.9l-5.2 2.62.99-5.8-4.21-4.1 5.82-.85L12 3.5z"
        stroke-linejoin="round"
      />
    </svg>
    {{ isFavorite ? 'В избранном' : 'Добавить в избранное' }}
  </button>
</template>
