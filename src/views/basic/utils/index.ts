import { Vertex, IMAGE_PATH, Point } from '../../../types'
import { reactive } from 'vue'
const replace_image = '/src/assets/element/icon.png'
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
      row.push({
        loc: { row: i, col: j },
        image: IMAGE_PATH + imageNames[Math.floor(Math.random() * 10)],
        visible: true,
      })
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
export const handleClicked = (
  grid: Vertex[][],
  loc: Point,
  selectedElement: Point[],
) => {
  grid[loc.row][loc.col].visible = false
  selectedElement.push(loc)
  if (selectedElement.length === 2) {
    if (
      grid[selectedElement[0].row][selectedElement[0].col].image ===
      grid[selectedElement[1].row][selectedElement[1].col].image
    ) {
      if (isAdjacent(selectedElement[0], selectedElement[1])) {
        handleSuccess(grid, selectedElement)
      }
      if (isInline(grid, selectedElement[0], selectedElement[1])) {
        handleSuccess(grid, selectedElement)
      }
    }

    resetStyle(grid, selectedElement)
    selectedElement.length = 0
  }
}
/**
 *
 * @param loc_first 被选中的元素1
 * @param loc_second 被选中的元素2
 * @returns true => 相邻元素且种类相同
 */
const isAdjacent = (loc1: Point, loc2: Point) => {
  return (
    (Math.abs(loc1.row - loc2.row) === 1 && loc1.col === loc2.col) ||
    (Math.abs(loc1.col - loc2.col) === 1 && loc1.row === loc2.row)
  )
}
/**
 * 判断是否在同一条直线上
 * @param grid
 * @param loc_first
 * @param loc_second
 */
const isInline = (grid: Vertex[][], loc1: Point, loc2: Point) => {
  if (loc1.row === loc2.row) {
    const startCol = Math.min(loc1.col, loc2.col)
    const endCol = Math.max(loc1.col, loc2.col)
    for (let col = startCol + 1; col < endCol; col++) {
      if (grid[loc1.row][col].image !== replace_image) {
        return false
      }
    }
    return true
  }

  if (loc1.col === loc2.col) {
    const startRow = Math.min(loc1.row, loc2.row)
    const endRow = Math.max(loc1.row, loc2.row)
    for (let row = startRow + 1; row < endRow; row++) {
      if (grid[row][loc1.col].image !== replace_image) {
        return false
      }
    }
    return true
  }
  return false
}
/**
 * 判断是否能通过两条直接抵达
 * @param grid
 * @param loc_first
 * @param loc_second
 */
const getByTwoLines = (
  grid: Vertex[][],
  loc_first: Point,
  loc_second: Point,
) => {}
/**
 * 判断是否能够通过三条直线抵达
 * @param grid
 * @param loc_first
 * @param loc_second
 */
const getByThreeLines = (
  grid: Vertex[][],
  loc_first: Point,
  loc_second: Point,
) => {}
/**
 * 能够消除的情况
 * @param grid
 * @param selectedElement
 */
const handleSuccess = (grid: Vertex[][], selectedElement: Point[]) => {
  grid[selectedElement[0].row][selectedElement[0].col].image = replace_image
  grid[selectedElement[1].row][selectedElement[1].col].image = replace_image
  resetStyle(grid, selectedElement)
}
/**
 * 用于重置样式
 * @param grid
 * @param selectedElement
 */
const resetStyle = (grid: Vertex[][], selectedElement: Point[]) => {
  grid[selectedElement[0].row][selectedElement[0].col].visible = true
  grid[selectedElement[1].row][selectedElement[1].col].visible = true
}
