<script lang="ts" setup>

import {inject} from "@vue/runtime-core";
import {onMounted, ref} from "vue";
import SimpleTable from '../components/SimpleTable.vue'
import {Parser} from 'sparqljs'
import {AppContext} from "../types";

const text: string = inject('text')
const context: AppContext = inject('context')

const data = ref()
const queryDebug = ref()
const error = ref()

async function doSelect(query: string) {
  context.triplestore.select(query)
      .then((result: any) => {
        data.value = context.config.selectToTable(result)
        queryDebug.value = query
      })
      .catch((e: any) => {
        error.value = e
      })
}

async function doConstruct(query: string) {
  context.triplestore.construct(query)
      .then((result: any) => {
        data.value = context.config.datasetToTable(result)
        queryDebug.value = query
      })
      .catch((e: any) => {
        error.value = e
      })
}

onMounted(async () => {
  // @ts-ignore
  const parser = new Parser({skipValidation: true, sparqlStar: true});

  try {
    const query: string = context.config.replaceInternalLinks(text, context.getFirstLinkpathDest)

    const parsed: any = parser.parse(query)
    if (parsed.queryType === 'SELECT') {
      await doSelect(query)
    } else if (parsed.queryType === 'CONSTRUCT') {
      await doConstruct(query)
    } else {
      error.value = `
      Don't know how to handle:

      ${JSON.stringify(query, null, 2)}
      `
    }

  } catch (e) {
    error.value = e.message
  }

})

</script>

<template>

  <template v-if="data">
    <template v-if="data.rows.length===0">
      <abbr :title="queryDebug">No results</abbr>
    </template>
    <simple-table :header="data.header" :rows="data.rows"/>
  </template>

  <div v-if="error">{{ error }}</div>

</template>
