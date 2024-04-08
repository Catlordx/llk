import { Vertex, IMAGE_PATH, Point } from '../../../types'
import { reactive } from 'vue'
const MATRIX_ROWS = 10
const MATRIX_COLS = 16
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
  console.log(grid)

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
  poly: Poly,
) => {
  grid[loc.row][loc.col].selected = true
  selectedElement.push(loc)

  if (selectedElement.length === 2) {
    const start = selectedElement[0]
    const end = selectedElement[1]
    if (grid[start.row][start.col].image === grid[end.row][end.col].image) {
      if (findPath(grid, start, end, poly)) {
        handleSuccess(grid, selectedElement)
        console.log(poly)
      }
    }
    resetStyle(grid, selectedElement)
    selectedElement.length = 0
  }
}
export function findPath(
  matrix: Vertex[][],
  current: Point,
  end: Point,
  pl: Poly,
) {
  let visited = new Set<Point>()
  let path: Point[] = []
  matrix[current.row][current.col].visible = false
  matrix[end.row][end.col].visible = false
  if (!dfs(matrix, current, end, path, visited)) {
    matrix[current.row][current.col].visible = true
    matrix[end.row][end.col].visible = true
  } else {
    pl.pl = pointPathToString(path)
    console.log(pl.pl)
  }
  if (path.length > 1) {
    return true
  }
  return false
}
function dfs(
  matrix: Vertex[][],
  current: Point,
  end: Point,
  path: Point[],
  visited: Set<Point>,
) {
  // 将当前的点添加到路径中
  const node: Point = {
    row: current.row,
    col: current.col,
  }
  path.push(node)
  visited.add(node)

  if (current.col === end.col && current.row === end.row) {
    return true
  }

  // 寻找当前点的邻居
  const neighbors = []
  const directions = [
    [1, 0], // 右
    [-1, 0], // 左
    [0, 1], // 上
    [0, -1], // 下
  ]
  for (const [dx, dy] of directions) {
    if (
      current.col + dy >= 0 &&
      current.col + dy < MATRIX_COLS &&
      current.row + dx >= 0 &&
      current.row + dx < MATRIX_ROWS
    ) {
      const neighbor: Point = {
        row: current.row + dx,
        col: current.col + dy,
      }
      neighbors.push(neighbor)
    }
  }

  // 遍历邻居
  for (const neighbor of neighbors) {
    if (!visited.has(neighbor) && !matrix[neighbor.row][neighbor.col].visible) {
      if (dfs(matrix, neighbor, end, path, visited)) return true
    }
  }

  // 回溯
  visited.delete(current)
  path.pop()
  return false
}
function pointPathToString(points: Point[]) {
  let resultString = ''
  for (let i = 0; i < points.length; i++) {
    let x = points[i].col * 40 + 26
    resultString += x.toString()
    resultString += ','
    let y = points[i].row * 40 + 48
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
