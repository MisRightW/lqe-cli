import ejs from 'ejs'
import fs from 'fs'
import prettier from 'prettier'
import { getRootPath } from "../../utils/index.js";

export default () => {
  const file = fs.readFileSync(getRootPath('template/main/main.ejs'))
  const code = ejs.render(file.toString(), {})
  // 格式化
  return prettier.format(code, { parser: 'babel' })
}
