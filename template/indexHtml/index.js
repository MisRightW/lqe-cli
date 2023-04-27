import ejs from 'ejs'
import fs from 'fs'
import prettier from "prettier";
import { getRootPath } from "../../utils/index.js";

export default ({ packageName }) => {
  const file = fs.readFileSync(getRootPath('template/indexHtml/indexHtml.ejs'))
  const code = ejs.render(file.toString(), { packageName })
  // 格式化
  return prettier.format(code, { parser: 'html' })
}
