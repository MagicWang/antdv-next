<docs lang="zh-CN">
通过 `align` 设置分页对齐方式。
</docs>

<docs lang="en-US">
Set pagination alignment with `align`.
</docs>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>

<template>
  <a-space direction="vertical" size="middle" style="width: 100%">
    <a-pagination v-model:current="current" align="start" :total="50" style="width: 100%" />
    <a-pagination v-model:current="current" align="center" :total="50" style="width: 100%" />
    <a-pagination v-model:current="current" align="end" :total="50" style="width: 100%" />
  </a-space>
</template>
