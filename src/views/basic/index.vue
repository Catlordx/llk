<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue'
import { Poly, handleClicked, initializeGrid } from './utils'
import { Point } from '../../types'
// 10行16列图片元素
const grid = initializeGrid(10, 16)
// 渲染开关
const isGameStarted = ref(false)
const startGame = () => {
  isGameStarted.value = true
}
const selectedElement: Point[] = []
// 创建折线
const svg_polyline: Poly = reactive({
  pl: '',
})
const svgVisible = ref(false)
watch(svg_polyline, () => {
  console.log(svg_polyline.pl)

  svgVisible.value = !svgVisible.value
  setTimeout(() => {
    svgVisible.value = !svgVisible.value
  }, 300)
})
// 挂载后加载音频文件，播放音乐
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
    <svg
      v-if="svgVisible"
      width="640"
      height="400"
      class="absolute top-6 left-2 z-50"
    >
      <polyline
        :points="svg_polyline.pl"
        fill="none"
        stroke="green"
        stroke-width="2"
      />
    </svg>
    <div v-if="isGameStarted" class="absolute w-640 top-6 left-2">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex">
        <div
          v-for="(vertex, colIndex) in row"
          :key="colIndex"
          style="display: inline-block"
        >
          <img
            :src="vertex.image"
            @click="
              handleClicked(grid, vertex.loc, selectedElement, svg_polyline)
            "
            :class="{
              'img-transparent': !vertex.visible,
              image: vertex.selected,
            }"
          />
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
.image {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.img-transparent {
  opacity: 0;
}
</style>
