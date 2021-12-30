<script setup>
import { defineProps, ref, onMounted, onBeforeMount } from 'vue'
import { PLUGIN_NAME } from './consts'
import { createClient } from './util/client'
import { canonicalizeVarName } from './util/normalize'


const props = defineProps({
  app: {
    type: Object,
    required: true
  }
})

async function doSomething () {
  console.log('doing something')

  const { rdf,cf,namespace,select,insert,construct } = createClient(props.app)

  const ns = {
    schema: namespace('http://schema.org/'),
    vault: namespace('http://vault.org/'),
    rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  }

  const uri = `http://vault/test/${canonicalizeVarName(current.value.path)}`

  const data = cf({ dataset: rdf.dataset(), term: rdf.namedNode(uri) })
      .addOut(ns.rdf.type, ns.vault.Note)
      .addOut(ns.rdf.name, current.value.name)

  console.log('data',data.dataset.toString())
  insert(data.dataset, uri )

  const query = `
    SELECT ?g ?s ?p ?o WHERE {
      GRAPH ?g {
        ?s ?p ?o.
      }
    }
  `
  const dataset = await select(query)
  console.log('dataset',dataset)
  for (const quad of dataset) {
    console.log(`${quad.g.value} ${quad.s.value} ${quad.p.value} ${quad.o.value}`)
  }
}


let current = ref({})
let metadata = ref({})

function updateView (file) {
  current.value = {
    name: file.name,
    path: file.path
  }
  const api = props.app.plugins.plugins.dataview?.api
  if (api) {
    metadata.value = api.index.pages.get(file.path)
  }
}

onBeforeMount(() => {
  let plugin = props.app.plugins.plugins[PLUGIN_NAME]
  plugin.registerEvent(
      props.app.metadataCache.on('dataview:metadata-change', (_, file) => {
        // When loading, dataview loads data of all pages.
        if (file.path === current.value.path) {
          updateView(file)
        }
      })
  )
  plugin.registerEvent(
      props.app.workspace.on('file-open', async (file) => {
        updateView(file)
      })
  )
})

onMounted(() => {
  const currentFile = props.app.workspace?.activeLeaf?.view?.file
  if (currentFile) {
    updateView(currentFile)
  }
})

</script>

<template>
  <div class="grid">
    <a @click="doSomething()">Do something</a>
    <div>{{ current }}</div>
    <div v-if="metadata">
      <div>ctime: {{ metadata.ctime }}</div>
      <div>mtime: {{ metadata.mtime }}</div>
      <div>size: {{ metadata.size }}</div>
      <h3>Fields</h3>
      <div v-for="[key, value] in metadata.fields">
        {{ key }} => {{ value }};
      </div>

      <h3>Tags</h3>
      <div v-for="(value, name) in metadata.tags">
        {{ value }}
      </div>

      <h3>Links</h3>
      <div v-for="(value, name) in metadata.links">
        {{ name }}: {{ value }}
      </div>

      <h3>Tasks</h3>
      <div v-for="(value, name) in metadata.tasks">
        {{ name }}: {{ value }}
      </div>
    </div>
  </div>
</template>

<style>

/*@import '../styles.css';*/

.grid {
  display: grid;
  padding: 10px;
}

</style>
