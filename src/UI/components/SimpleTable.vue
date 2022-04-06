<script lang="ts" setup>
import {PropType} from 'vue'
import {ns} from "../../namespaces";
import {shrink} from "../../triplifiers/utils";
import InternalLink from "./InternalLink.vue"
import {AppContext, SparqlConfig} from "../../types";
import {inject} from "@vue/runtime-core";

const context: AppContext = inject('context')

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

<!--Perhaps this could be prettier, see:-->
<!--https://codepen.io/team/Vue/pen/BaKbowJ-->

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
          <internal-link :linkTo="context.config.uriToPath(value)" class="clickable"/>
        </template>
        <template v-else>
          {{ shrink(value) }}
        </template>
      </td>
    </tr>
  </table>
</template>