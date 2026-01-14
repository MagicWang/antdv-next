<docs lang="zh-CN">
基本用法。
</docs>

<docs lang="en-US">
Basic usage.
</docs>

<script lang="ts" setup>
const content = 'This is a content.'
const items = [
  {
    title: 'Finished',
    description: content,
  },
  {
    title: 'In Progress',
    description: content,
    subTitle: 'Left 00:00:08',
  },
  {
    title: 'Waiting',
    description: content,
  },
]
</script>

<template>
  <a-flex vertical gap="large">
    <a-steps :current="1" :items="items" />
    <a-steps :current="1" :items="items" variant="outlined" />
    <a-steps :current="1" :items="items" size="small" />
    <a-steps :current="1" :items="items" size="small" variant="outlined" />
  </a-flex>
</template>
