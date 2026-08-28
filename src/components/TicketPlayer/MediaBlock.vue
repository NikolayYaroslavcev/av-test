<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import placeholder from '../../assets/image-placeholder.svg';

const props = defineProps<{ image: string }>();
defineEmits<{ 'open-paywall': [] }>();

const errored = ref(false);
watch(
  () => props.image,
  () => {
    errored.value = false;
  },
);

const src = computed(() => (errored.value ? placeholder : props.image));
</script>

<template>
  <div>
    <div class="overflow-hidden rounded-card border border-border bg-surface-muted">
      <img
        :src="src"
        alt=""
        class="aspect-video w-full object-cover"
        loading="lazy"
        @error="errored = true"
      />
    </div>
    <button
      type="button"
      class="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-pill bg-accent px-4 py-3 text-sm font-semibold text-text-on-accent outline-none transition duration-200 ease-out hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      @click="$emit('open-paywall')"
    >
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke-linecap="round" />
      </svg>
      3D-Видеоразбор
    </button>
  </div>
</template>
