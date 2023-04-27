#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import { Command } from 'commander'

const program = new Command();

let config = {};
// 配置文件如果存在则读取
if(fs.existsSync(path.resolve('meet.config.js'))){
    config = require(path.resolve('meet.config.js'));
}

program
    .version('1.0.0','-v, --version')
    .command('init')
    .description('initialize your meet config')
    .action('');

program
    .command('new [module]')
    .description('generator a new module')
    .action(function(module){
        gmodule(config,module)
    });

program
    .command('getTables')
    .description('获取表格数据')
    .action(function(){
      console.error('Run script %s on port %s', this.args[0], this.opts().port);
    })

program.parse(process.argv);