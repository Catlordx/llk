export interface Point {
  row: number
  col: number
}
/**
 * 顶点结构体
 */
export interface Vertex {
  /**
   * 顶点坐标
   */
  loc: Point
  /**
   * 顶点对应的图片
   */
  image: string
  /**
   * 该图片是否被消去
   */
  visible: boolean
  /**
   * 改图片是否被选中
   */
  selected: boolean
}
