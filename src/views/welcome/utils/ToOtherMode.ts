import { appWindow } from '@tauri-apps/api/window'
import router from '../../../router'
import { invoke } from '@tauri-apps/api'
async function test() {
  await invoke('image_handler', {})
}
export const toBasicMode = () => {
  appWindow.setTitle('基本模式')
  router.push({ name: 'basic' })
}
export const toRelaxMode = () => {
  appWindow.setTitle('休闲模式')
  router.push({ name: 'relax' })
}