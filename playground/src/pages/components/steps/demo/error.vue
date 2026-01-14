<docs lang="zh-CN">
步骤运行错误。
使用 `status` 属性来指定当前步骤的状态。
</docs>

<docs lang="en-US">
Error status.
By using `status` of `Steps`, you can specify the state for current step.
</docs>

<script lang="ts" setup>
const content = 'This is a content'
const items = [
  {
    title: 'Finished',
    description: content,
  },
  {
    title: 'In Process',
    description: content,
  },
  {
    title: 'Waiting',
    description: content,
  },
]
</script>

<template>
  <a-steps :current="1" status="error" :items="items" />
</template>
