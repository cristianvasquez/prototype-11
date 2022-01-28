<script lang="ts" setup>

import {inject} from "@vue/runtime-core";
import {onMounted, ref} from "vue";
import {shrink} from "../triplifiers/utils";
import {Triplestore} from "../lib/client";

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
    rows.push(Object.values(current).map((current) => shrink(current.value)))
  }
  data.value = {
    header: header,
    rows: rows
  }
})

</script>

<template>

  <template v-if="data">
    <table>
      <thead>
      <tr>
        <th v-for="header of data.header">{{ header }}</th>
      </tr>
      </thead>

      <tr v-for="row of data.rows">
        <td v-for="value of row">{{ value }}</td>
      </tr>
    </table>
  </template>
</template>
