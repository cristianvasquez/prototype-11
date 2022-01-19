<script setup>
import {
  hoverPreview,
  isInVault,
  openOrSwitch,
} from 'obsidian-community-lib'
import { inject } from '@vue/runtime-core'
import { getFileTitle } from '../lib/obsidianHelpers'

const props = defineProps({
  linkTo: {
    type: String,
    required: true
  }
})
const app = inject('app')
const view = inject('view')

async function open (event) {
  await openOrSwitch(app, props.linkTo, event)
}

async function hover (event) {
  await hoverPreview(event, view, props.linkTo)
}

</script>

<template>
        <span
            class="internal-link"
            @click="open"
            @mouseover="hover"
        >
          <a
              :class="isInVault(app, linkTo)?'':'is-unresolved'"
              class="internal-link"
          >{{ getFileTitle(props.linkTo) }}</a
          >
        </span>
</template>