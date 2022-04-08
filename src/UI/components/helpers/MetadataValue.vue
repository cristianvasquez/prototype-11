<script setup>
import InternalLink from './InternalLink.vue'
import { toRaw } from 'vue'
import { getSpans } from '../renderingUtils'

const props = defineProps({
  value: {
    type: Object,
    required: true
  }
})

function hasLinks () {
  return props.value.entities?.internalLinks != null
}

function spanify () {
  const text = toRaw(props.value.value)
  const links = toRaw(props.value.entities.internalLinks)
  return (text, links)
}

</script>

<template>
  <div v-if="hasLinks()" class="words">
    <template v-for="span in getSpans(props.value.value,props.value.entities.internalLinks)">
      <template v-if="span.type==='link'">
        <internal-link :linkTo="span.value" class="clickable"/>
      </template>
      <template v-else>{{ span.value }}</template>
    </template>
  </div>
  <div v-else>{{ props.value.value }}</div>
</template>
