<docs lang="zh-CN">
展示所有配置选项。
</docs>

<docs lang="en-US">
Show all configured prop.
</docs>

<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'
import { ref } from 'vue'

const showTotal: PaginationProps['showTotal'] = total => `Total ${total} items`
const current = ref(1)
const pageSize = ref(10)
</script>

<template>
  <a-pagination
    v-model:current="current"
    v-model:page-size="pageSize"
    :total="85"
    show-size-changer
    show-quick-jumper
    :show-total="showTotal"
  />
</template>
