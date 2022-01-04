<script setup>

const props = defineProps({
  property: {
    type: Object,
    required: true
  },
  labels: {
    type: Object,
    required: false
  }
})

</script>

<template>
  <abbr :title="props.labels">{{ props.property }}</abbr>
</template>
