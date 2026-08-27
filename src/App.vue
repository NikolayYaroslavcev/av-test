<script setup lang="ts">
import TicketPlayer from './components/TicketPlayer/TicketPlayer.vue';
import ticketData from './data/ticket-1.json';
import type { Ticket } from './types/ticket';

const questions = ticketData as Ticket;
</script>

<template>
  <TicketPlayer ticket-id="ticket-1" :questions="questions" />
</template>
