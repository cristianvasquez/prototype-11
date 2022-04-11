<script lang="ts" setup>
import {inject} from "@vue/runtime-core";
import {AppContext} from '../../types'
import {computed, onMounted, ref} from "vue";
import {canonical, rawToURI} from '../../triplifiers/DotTriplesTriplifier.js'

const term: any = inject('term')
const context: AppContext = inject('context')

const customProperties = ref()


onMounted(async () => {
  const settings = await context.plugin.loadData()
  customProperties.value = settings.customProperties
})

const can = computed(() => term?.raw ? canonical(term.raw) : undefined)

const uri = computed(() => term?.raw ? rawToURI(term.raw) : undefined)
</script>

<template>

  <template v-if="term">
    <div>
      @TODO, set from here custom prefixes on demand.
    </div>
    <div>
      Term: {{ term }}
    </div>
    <div>
      Canonical {{ can }}
    </div>
    <div>
      Uri from raw: {{ uri }}
    </div>
  </template>
  <div v-if="customProperties">
    Custom properties: {{ customProperties }}>
  </div>
</template>