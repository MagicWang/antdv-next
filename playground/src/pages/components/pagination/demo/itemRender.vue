<docs lang="zh-CN">
修改上一步和下一步为文字链接。
</docs>

<docs lang="en-US">
Use text link for prev and next button.
</docs>

<template>
  <a-pagination :total="500">
    <template #itemRender="{ type, element }">
      <a v-if="type === 'prev'">Previous</a>
      <a v-else-if="type === 'next'">Next</a>
      <template v-else>
        <component :is="element" />
      </template>
    </template>
  </a-pagination>
</template>
