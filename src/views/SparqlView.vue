<script lang="ts" setup>

import {inject} from "@vue/runtime-core";
import {onMounted, ref} from "vue";
import SimpleTable from '../components/SimpleTable.vue'
import {Parser} from 'sparqljs'
import {AppContext} from "../types";

const text: string = inject('text')
const context: AppContext = inject('context')

const data = ref()
const error = ref()

async function doSelect() {
  context.triplestore.select(text)
      .then((result: any) => {
        data.value = context.config.selectToTable(result)
      })
      .catch((e: any) => {
        error.value = e
      })
}

async function doConstruct() {
  context.triplestore.construct(text)
      .then((result: any) => {
        data.value = context.config.datasetToTable(result)
      })
      .catch((e: any) => {
        error.value = e
      })
}

onMounted(async () => {
  // @ts-ignore
  const parser = new Parser({skipValidation: true, sparqlStar: true});

  try {
    const query: any = parser.parse(text)
    if (query.queryType === 'SELECT') {
      await doSelect()
    } else if (query.queryType === 'CONSTRUCT') {
      await doConstruct()
    } else {
      error.value = `
      Don't know how to handle:

      ${JSON.stringify(query, null, 2)}
      `
    }

  } catch (e) {
    error.value = e
  }

})

</script>

<template>
  <template v-if="data">
    <simple-table :header="data.header" :rows="data.rows"/>
  </template>

  <div v-if="error">{{ error }}</div>


</template>
