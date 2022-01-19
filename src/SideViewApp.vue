<script lang="ts" setup>
import {onBeforeMount, onMounted, ref} from 'vue'
import {PLUGIN_NAME} from './consts'
import {inject} from '@vue/runtime-core'
import {getDataByFile} from './lib/obsidianHelpers'
import Metadata from './components/Metadata.vue'
import {getMetadata} from "./lib/extract";
import {App, TAbstractFile, TFile} from "obsidian";

const app: App = inject('app')

let title = ref('loading')
let metadata = ref({})

async function updateView(file: TAbstractFile) {
  title.value = file.name

  const t0 = performance.now();
  const data = await getDataByFile(app, file as TFile)
  const t1 = performance.now();
  console.log(`getDataByFile ${file.name}: ${t1 - t0} milliseconds.`);
  metadata.value = await getMetadata(data)
  const t2 = performance.now();
  console.log(`getMetadata ${file.name}: ${t2 - t1} milliseconds.`);

}

onBeforeMount(() => {
  // @ts-ignore
  let plugin = app.plugins.plugins[PLUGIN_NAME]

  plugin.registerEvent(
      app.metadataCache.on('changed', file => {
        updateView(file)
      })
  )

  plugin.registerEvent(
      app.vault.on('rename', (file, oldPath) => {
        console.log('rename', file)
        updateView(file)
      })
  )

  plugin.registerEvent(
      app.vault.on('delete', af => {
        if (!(af instanceof TFile)) return
        console.log('delete', af)
      })
  )

  plugin.registerEvent(
      app.workspace.on('file-open',  (file) => {
        updateView(file)
      })
  )

})

onMounted(() => {
  // @ts-ignore
  const currentFile = app.workspace?.activeLeaf?.view?.file
  if (currentFile) {
    updateView(currentFile)
  }
})

</script>

<template>
  <div class="grid">
    <h1>{{ title }}</h1>
    <Metadata v-if="metadata" :metadata="metadata"/>
  </div>
</template>

<style>

.grid {
  display: grid;
  padding: 10px;
}

</style>
