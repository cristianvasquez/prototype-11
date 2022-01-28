<script lang="ts" setup>

import {inject} from "@vue/runtime-core";
import {onMounted, ref} from "vue";
import {Triplestore} from "../lib/client";
import SimpleTable from '../components/SimpleTable.vue'

const text: string = inject('text')
const triplestore: Triplestore = inject('triplestore')

const data = ref()

onMounted(async () => {
  const result = await triplestore.select(text)
  let header = null
  let rows = []
  for (const current of result) {
    if (!header) {
      header = Object.keys(current)
    }
    rows.push(Object.values(current).map((current) => current.value))
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
