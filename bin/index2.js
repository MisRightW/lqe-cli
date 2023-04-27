#!/usr/bin/env node

import fs from 'fs'
import { execa } from 'execa';
import chalk from 'chalk'
import question from '../prompt/index.js'

import indexHtml from '../template/indexHtml/index.js'
import main from '../template/main/index.js'
import packageJson from '../template/package/index.js'
import webpackConfig from '../template/webpackConfig/index.js'

const config = await question()
console.log(config);

// 创建的项目路径
const getProjectPath = () => {
  return `./${ config.packageName }`
}

// 1. 创建文件夹
console.log(chalk.blue(`创建文件夹 -> ${getProjectPath()}`));
fs.mkdirSync(getProjectPath())
fs.mkdirSync(`${getProjectPath()}/src`)

// 2. 创建文件和入口文件
console.log(chalk.blue(`创建文件和入口文件 -> index.js`));
fs.writeFileSync(`${getProjectPath()}/src/index.js`, main())
fs.writeFileSync(`${getProjectPath()}/index.html`, indexHtml(config))
fs.writeFileSync(`${getProjectPath()}/webpack.config.js`, webpackConfig(config))

// 3. 创建package.json
console.log(chalk.blue(`创建package.json`));
fs.writeFileSync(`${getProjectPath()}/package.json`, packageJson(config))

// 4. 安装依赖
console.log(chalk.blue(`开始安装依赖`));
execa(config.installTool, ['install'], {
  cwd: getProjectPath(),
  stdio: [2, 2, 2]
})

// 5. 操作git
await execa(`git`, ['init'], { cwd: getProjectPath(), })
await execa(`git`, ['add', './'], { cwd: getProjectPath(), })
await execa(`git`, ['commit', '-m', 'init'], { cwd: getProjectPath(), })

// 6. 拉取远程仓库代码作为代码模板
// await execa(`git`, ['clone', 'https://gitee.com/yanhuakang/my-first-npm-lib.git'], { cwd: './', })
// await execa(`mv`, ['my-first-npm-lib', config.packageName], { cwd: './', })
// await execa(`rm`, ['-rf', `${getProjectPath()}/.git`], { cwd: './', })
// await execa(`cd`, [config.packageName], { cwd: './', })
// await execa(`npm`, ['init'], { cwd: './', })
