<script setup>
import MetadataValue from '../MetadataValue.vue'
import {toRaw} from 'vue'

/**
 * For the moment I only want one array level.
 * I want to keep this simple in the meantime.
 */
const props = defineProps({
  value: {
    type: Object,
    required: true
  }
})

function isArray() {
  return Array.isArray(toRaw(props.value.value));
}

</script>

<template>
  <div v-if="isArray()" class="array">

    <template v-for="current in props.value.value">
      <metadata-value :value="current"/>
    </template>
  </div>
  <div v-else>
    <metadata-value :value="props.value"/>
  </div>

</template>

<style scoped>

.array {
  display: flex;
  flex-direction: column;
}

</style>