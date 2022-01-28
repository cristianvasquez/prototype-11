<script lang="ts" setup>

import {inject} from "@vue/runtime-core";
import {onMounted, ref} from "vue";
import {Triplestore} from "../lib/client";
import {ns} from '../namespaces'
import {uriToPath} from '../triplifiers/uri'
import {shrink} from "../triplifiers/utils";
import InternalLink from '../components/InternalLink.vue'

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
//    rows.push(Object.values(current).map((current) => shrink(current.value)))
    rows.push(Object.values(current).map((current) => current.value))

  }
  data.value = {
    header: header,
    rows: rows
  }
})

function isInternal(value: string) {
  return value.startsWith(ns.this())
}

function getPath(value: string) {
  return uriToPath(value)
}

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
        <td v-for="value of row">
          <template v-if="isInternal(value)">
            <internal-link :linkTo="getPath(value)" class="clickable"/>
          </template>
          <template v-else>
            {{ shrink(value) }}
          </template>
        </td>
      </tr>
    </table>
  </template>
</template>
