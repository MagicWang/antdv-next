<script setup lang="ts">
import Header from '../base/header.vue'
import Main from '../base/main.vue'
</script>

<template>
  <div class="w-full h-full">
    <Header />
    <Main>
      <router-view />
    </Main>
  </div>
</template>
