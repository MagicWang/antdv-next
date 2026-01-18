<docs lang="zh-CN">
校验失败时自动滚动到首个错误字段。
</docs>

<docs lang="en-US">
Scroll to the first error field on validate failed.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  field1: '',
  field2: '',
  field3: '',
  field4: '',
  field5: '',
  field6: '',
  field7: '',
  field8: '',
})
</script>

<template>
  <div style="max-height: 280px; overflow: auto; padding-right: 8px">
    <a-form
      :model="model"
      layout="vertical"
      scroll-to-first-error
      style="max-width: 600px"
    >
      <a-form-item v-for="i in 8" :key="i" :name="`field${i}`" :label="`Field ${i}`" :rules="[{ required: true }]">
        <a-input v-model:value="model[`field${i}`]" placeholder="required" />
      </a-form-item>
      <a-form-item :label="null">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
