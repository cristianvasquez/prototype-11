<script lang="ts" setup>
import {inject} from "@vue/runtime-core";
import {AppContext, Dataset} from '../types'
import {onMounted, ref} from "vue";
import SimpleTable from "./SimpleTable.vue"

const dataset: Dataset = inject('dataset')
const context: AppContext = inject('context')

const data = ref()

onMounted(async () => {
  data.value = context.config.datasetToTable(dataset)
})

</script>

<template>
  <template v-if="data">
    <simple-table :header="data.header" :rows="data.rows"/>
  </template>
</template>