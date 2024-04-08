import { Vertex, IMAGE_PATH, Point } from '../../../types'
import { reactive, toRaw } from 'vue'
import { invoke } from '@tauri-apps/api'
/**
 * pl:存放直线上的点的坐标
 */
export interface Poly {
  pl: string
}
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
export function initializeGrid(numRows: number, numCols: number): Vertex[][] {
  const grid: Vertex[][] = reactive([])

  for (let i = 0; i < numRows; i++) {
    const row: Vertex[] = reactive([]) // 显式声明行的类型
    for (let j = 0; j < numCols; j++) {
      row.push(
        reactive({
          loc: { row: i, col: j },
          image: IMAGE_PATH + imageNames[Math.floor(Math.random() * 10)],
          visible: true,
          selected: false,
        }),
      )
    }
    grid.push(row)
  }
  return grid
}
/**
 *
 * 将选中元素加入缓冲区，满足一定长度判断是否成功消除
 * @param grid 游戏界面元素情况
 * @param loc 选中元素的位置
 */
export const handleClicked = async (
  grid: Vertex[][],
  loc: Point,
  selectedElement: Point[],
  poly: Poly,
) => {
  grid[loc.row][loc.col].selected = true
  selectedElement.push(loc)

  if (selectedElement.length === 2) {
    if (
      grid[selectedElement[0].row][selectedElement[0].col].image ===
      grid[selectedElement[1].row][selectedElement[1].col].image
    ) {
      const start = selectedElement[0]
      const end = selectedElement[1]
      let matrix = toRaw(grid)
      matrix[start.row][start.col].visible = false
      matrix[end.row][end.col].visible = false

      const demo: Point[] = await invoke('find_path', {
        matrix: matrix,
        current: start,
        end: end,
      })
      if (demo.length === 0) {
        grid[start.row][start.col].visible = true
        grid[end.row][end.col].visible = true
      }
      const pathString = pointPathToString(demo)
      poly.pl = pathString
      console.log(pathString)
    }
    resetStyle(grid, selectedElement)
    selectedElement.length = 0
  }
}
function pointPathToString(points: Point[]) {
  let resultString = ''
  for (let i = 0; i < points.length; i++) {
    let x = points[i].col * 40 + 20
    resultString += x.toString()
    resultString += ','
    let y = points[i].row * 40 + 20
    resultString += y.toString()
    resultString += ' '
  }
  return resultString.trimEnd()
}
/**
 * 能够消除的情况
 * @param grid
 * @param selectedElement
 */
const handleSuccess = (grid: Vertex[][], selectedElement: Point[]) => {
  grid[selectedElement[0].row][selectedElement[0].col].visible = false
  grid[selectedElement[1].row][selectedElement[1].col].visible = false
  resetStyle(grid, selectedElement)
}
/**
 * 用于重置样式
 * @param grid
 * @param selectedElement
 */
const resetStyle = (grid: Vertex[][], selectedElement: Point[]) => {
  grid[selectedElement[0].row][selectedElement[0].col].selected = false
  grid[selectedElement[1].row][selectedElement[1].col].selected = false
}
