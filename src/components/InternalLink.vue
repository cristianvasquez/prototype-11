<script lang="ts" setup>
import {hoverPreview, isInVault, openOrSwitch,} from 'obsidian-community-lib'
import {inject} from '@vue/runtime-core'
import {getFileTitle} from '../lib/obsidianHelpers'
import {SIDE_VIEW_ID} from '../main'
import {AppContext} from '../types'
import {PropType} from "vue";
import {ItemView} from "obsidian";

const context: AppContext = inject('context')

const props = defineProps({
  linkTo: {
    type: String as PropType<string>,
    required: true
  }
})

async function open(event: MouseEvent) {
  await openOrSwitch(context.app, props.linkTo, event)
}

async function hover(event: MouseEvent) {
  //@ts-Ignore
  const trickObsidianAPI:ItemView = {
    app: context.app,
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
              :class="isInVault(context.app, linkTo)?'':'is-unresolved'"
              class="internal-link"
          >{{ getFileTitle(props.linkTo) }}</a
          >
        </span>
</template>