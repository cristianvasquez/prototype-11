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
  <div>
    {{ props.labels }} {{ props.property }}
  </div>
</template>