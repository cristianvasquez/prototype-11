<script setup>
import InternalLink from './InternalLink.vue'
import {dateTimeFormat} from '../consts'

const props = defineProps({
  value: {
    type: Object,
    required: true
  }
})

function isFile () {
  return props.value.type === 'file'
}

function isDate () {
  return props.value.isLuxonDateTime
}


</script>

<template>
  <div v-if="isFile()">
    <internal-link :linkTo="props.value.path" />
  </div>
  <div v-else-if="isDate()">
    {{ props.value.toLocaleString(dateTimeFormat) }}
  </div>
  <div v-else>{{ props.value }}</div>
</template>