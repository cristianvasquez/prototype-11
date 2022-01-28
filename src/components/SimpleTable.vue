<script lang="ts" setup>
import {PropType} from 'vue'
import {ns} from "../namespaces";
import {uriToPath} from '../triplifiers/uri'
import {shrink} from "../triplifiers/utils";
import InternalLink from "./InternalLink.vue"
const props = defineProps({
  header: {
    type: Object as PropType<Array<String>>,
    required: true
  },
  rows: {
    type: Object as PropType<Array<Array<String>>>,
    required: true
  }
})

function isInternal(value: string) {
  return value.startsWith(ns.this())
}

</script>
<template>
  <table>
    <thead>
    <tr>
      <th v-for="header of props.header">{{ header }}</th>
    </tr>
    </thead>
    <tr v-for="row of props.rows">
      <td v-for="value of row">
        <template v-if="isInternal(value)">
          <internal-link :linkTo="uriToPath(value)" class="clickable"/>
        </template>
        <template v-else>
          {{ shrink(value) }}
        </template>
      </td>
    </tr>
  </table>
</template>