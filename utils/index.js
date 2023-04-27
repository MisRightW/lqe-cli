import path from 'path'
import { fileURLToPath } from 'url'
// 获取绝对路径
export const getRootPath = (pathUrl) => {
  // esm 模块没有 CommonJS的 __dirname
  // 这里需要通过工具函数fileURLToPath来封装一个__dirname
  const __dirname = fileURLToPath(import.meta.url)
  return path.resolve(__dirname, `../../${pathUrl}`)
}
