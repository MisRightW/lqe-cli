import Trie from 'triejs'
import fs from 'fs'
import express from 'express'
// import ffi from 'ffi'
import { createReadStream } from 'fs'
import fastJson from 'fast-json-stringify'
import parse from 'fast-json-parse'
import { compareTwoStrings } from 'string-similarity'

const app = express()

const trie = new Trie()

// 读取数据文件，生成 Trie 树和地址信息的映射表  ./district_data3.json
const data = fs.readFileSync('./district_data3.json', 'utf-8')
const dataList = JSON.parse(data)

// const data = fs.readFileSync('./data/province_city_area.csv', 'utf-8')
// const dataList = [
//   '北京市,北京市,东城区,东华门街道',
//   '北京市,北京市,东城区,景山街道',
//   '北京市,北京市,西城区,什刹海街道',
//   '北京市,北京市,西城区,德胜街道',
//   '北京市,北京市,朝阳区,大山子街道',
//   '北京市,北京市,朝阳区,亚运村街道',
//   '北京市,北京市,海淀区,中关村街道',
//   '北京市,北京市,海淀区,上地街道',
//   '天津市,天津市,河西区,越秀路街道',
//   '天津市,天津市,河西区,桃园街道'
// ]

// 将地址信息存入集合中
const addressSet = new Set(dataList)

// 将地址信息插入到前缀树中
for (const line of dataList) {
  const [province, city, district, county] = line.split(',')
  trie.add(`${province},${city},${district},${county}`, line)
}


// 定义查询地址信息函数
function searchAddress(keyword) {
  let key = keyword.query
  const result = []

  // 计算当前搜索关键字与集合中每个地址的相似度，并将相似度高于一定阈值的地址加入结果列表
  for (const address of addressSet) {
    const similarity = compareTwoStrings(key, address)
    if (similarity >= 0.2) {  // 相似度阈值为 0.5
      result.push(address)
    }
  }

  return result
}

function get(key) {
  let node = trie.root
  for(var i = 0; i < key.length; i++) {
      char = key.charAt(i)
      child = node.getChild(char)
      if (child == null) {
        return null
      }
      node = child
  }
  return node.getValue()
}


// 将查询结果转换为 JSON 格式
const jsonFormat = fastJson({
  type: 'array',
  properties: {
    province: { type: 'string' },
    city: { type: 'string' },
    district: { type: 'string' },
    county: { type: 'string' }
  }
})
function formatResult(result) {
  return jsonFormat(result)
}

// 将 Node.js 实现封装成接口，并导出供 Java 项目调用
// const lib = ffi.Library('./build/Release/libnode', {
//   'searchAddress': ['string', ['string']]
// })

app.get('/search', (req, res) => {
  const keyword  = req.query

  // 调用封装好的接口函数或是直接查询内存中的映射表
  let result = {}
  // if (typeof lib.searchAddress === 'function') {
  //   result = parse(lib.searchAddress(keyword))
  // } else {
    result = searchAddress(keyword)
  // }

  // 将查询结果转换为 JSON 格式，并返回给 Java 客户端
  res.send(formatResult(result))
})

const server = app.listen(3000, () => console.log('Server is running at http://localhost:3000'))
