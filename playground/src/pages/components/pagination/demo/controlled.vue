<docs lang="zh-CN">
受控制的页码。
</docs>

<docs lang="en-US">
Controlled page number.
</docs>

<script setup lang="ts">
import type { PaginationEmits } from 'antdv-next'
import { ref } from 'vue'

const current = ref(3)
const pageSize = ref(10)

const handleChange: PaginationEmits['change'] = (page, pageSize) => {
  console.log(page, pageSize)
}
</script>

<template>
  <a-pagination v-model:current="current" v-model:page-size="pageSize" :total="50" @change="handleChange" />
</template>
