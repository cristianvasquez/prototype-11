<script lang="ts" setup>
import {inject} from "@vue/runtime-core";
import {Dataset} from '../types'
import {onMounted, ref} from "vue";
import SimpleTable from "./SimpleTable.vue"

const dataset: Dataset = inject('dataset')

const data = ref()

onMounted(async () => {
  let header = ['subject', 'predicate', 'object']
  let rows = []
  for (const quad of dataset) {
    rows.push([quad.subject.value, quad.predicate.value, quad.object.value])
  }
  data.value = {
    header: header,
    rows: rows
  }
})
</script>

<template>
  <template v-if="data">
    <simple-table :header="data.header" :rows="data.rows"/>
  </template>
</template>