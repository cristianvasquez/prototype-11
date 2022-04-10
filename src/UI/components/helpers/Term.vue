<script setup>
import InternalLink from './InternalLink.vue'
import { getSpans } from '../renderingUtils'

const props = defineProps({
  term: {
    required: true
  }
})

</script>

<template>
  <div v-if="term.entities" class="words">
    <template v-for="span in getSpans(term.raw, term.entities.map((entity)=>entity.name))">
      <template v-if="span.type==='link'">
        <internal-link :linkTo="span.value" class="clickable"/>
      </template>
      <template v-else>{{ span.value }}</template>
    </template>
  </div>
  <div v-else>{{ term.raw }}</div>
</template>
