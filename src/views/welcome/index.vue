<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { toBasicMode, toRelaxMode } from './utils/ToOtherMode'
</script>

<template>
  <div class="container">
    <el-button
      type="primary"
      class="button-basic"
      size="large"
      @click="toBasicMode"
    >
      基本模式
    </el-button>
    <el-button
      type="primary"
      class="button-relax"
      size="large"
      @click="toRelaxMode"
    >
      休闲模式
    </el-button>
    <el-button type="primary" class="button-checkpoint" size="large">
      关卡模式
    </el-button>
    <div class="flex absolute bottom-0 right-0 mb-2 mr-3">
      <el-button type="primary">排行榜</el-button>
      <el-button type="primary">设置</el-button>
      <el-button type="primary">帮助</el-button>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-image: url('/src/assets/llk_main.png');
  background-size: cover;
  width: 100%;
  height: 100vh;
}

.button-basic {
  position: absolute;
  top: 230px;
  left: 30px;
}

.button-relax {
  position: absolute;
  top: 340px;
  left: 20px;
}

.button-checkpoint {
  position: absolute;
  top: 450px;
  left: 20px;
}
</style>
