<script setup>
import {
  hoverPreview,
  isInVault,
  openOrSwitch,
} from 'obsidian-community-lib'
import { inject } from '@vue/runtime-core'
import { getFileTitle } from '../lib/obsidianHelpers'
import { SIDE_VIEW_ID } from '../main'

const props = defineProps({
  linkTo: {
    type: String,
    required: true
  }
})
const app = inject('app')

async function open (event) {
  await openOrSwitch(app, props.linkTo, event)
}

async function hover (event) {
  const trickObsidianAPI = {
    app: app,
    getViewType: () => SIDE_VIEW_ID // 'prototype-11-sideview'
  }

  await hoverPreview(event, trickObsidianAPI, props.linkTo)
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