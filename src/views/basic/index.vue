<script setup lang="ts">
import { IMAGE_PATH, Vertex } from '../../types'
import { ref, onMounted } from 'vue'
const imageNames = [
  'image_0.png',
  'image_1.png',
  'image_2.png',
  'image_3.png',
  'image_4.png',
  'image_5.png',
  'image_6.png',
  'image_7.png',
  'image_8.png',
  'image_9.png',
]
const numRows = 10
const numCols = 16
const grid: Vertex[][] = []
// 初始化二维数组 16行10列
for (let i = 0; i < numRows; i++) {
  const row: Vertex[] = []
  for (let j = 0; j < numCols; j++) {
    // 这里你可以根据需要进行初始化
    row.push({
      loc: { row: i, col: j },
      image: IMAGE_PATH + imageNames[Math.floor(Math.random() * 10)],
      visible: false,
    })
  }
  console.log(row)
  grid.push(row)
}
const isGameStarted = ref(false)
const startGame = () => {
  isGameStarted.value = true
}
onMounted(() => {
  const audio = new Audio('/Joel Hanson,Sara Groves - Traveling Light.mp3')
  audio.play()
})
</script>

<template>
  <div class="container">
    <div class="flex flex-col w-20 absolute right-6 top-6">
      <button
        class="shadow-xl bg-white mt-2 mr-1 h-8 hover:bg-white-400"
        @click="startGame"
      >
        开始游戏
      </button>
      <button class="shadow-xl bg-white mt-2 mr-1 h-8 hover:bg-white-400">
        暂停游戏
      </button>
      <button class="shadow-xl bg-white mt-2 mr-1 h-8 hover:bg-white-400">
        展示
      </button>
      <button class="shadow-xl bg-white mt-2 mr-1 h-8 hover:bg-white-400">
        重排
      </button>
    </div>
    <div v-if="isGameStarted" class="absolute w-640 top-6 left-2">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex">
        <div v-for="(vertex, colIndex) in row" :key="colIndex" style="display: inline-block;">
          <img :src="vertex.image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-image: url('/src/assets/fruit_bg.bmp');
  background-size: cover;
  width: 100%;
  height: 100vh;
}
</style>
