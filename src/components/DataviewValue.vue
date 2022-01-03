<script setup>
import InternalLink from './InternalLink.vue'

const props = defineProps({
  value: {
    type: Object,
    required: true
  }
})

function isFile () {
  return props.value.type === 'file'
}

</script>

<template>
  <div v-if="isFile()">
    <internal-link :linkTo="props.value.path" />
  </div>
  <div v-else>{{ props.value }}</div>
</template>