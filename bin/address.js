import cheerio from 'cheerio'

function getAddress() {
  //1、创建一个 xhr 的对象
  let xhr = new XMLHttpRequest()
  //2、调用xhr中的open()函数,创建一个Ajax的请求
  xhr.open('GET', 'https://www.mca.gov.cn/article/sj/xzqh/2022/202201xzqh.html')
  //3、调用xhr的send函数，发起请求
  xhr.send()
  //4、监听 onreadystatechange 事件
  xhr.onreadystatechange = function () {
    //固定写法
    if (xhr.readyState === 4 && xhr.status === 200) {  
        //数据获取成功，获取服务器响应的数据 
        console.log(xhr.responseText)
        change(xhr.responseText)
    }
  }
}

function change(addr) {
  const value = []
  const $ = cheerio.load(addr)
  var tds = $('td')
  // tds.each((index, item) => {
  //   var text = item.text;
  //   if (text) {
  //     value.push('')
  //   }
  // })
  let table = getTables($)
  console.log('table', table)
}

/* 解析页面 HTML 表格为 JSON 数据 */
function getTables(document){
	var tables = [], tablesHtml = document.querySelectorAll('table');

	tablesHtml.forEach(function(tb){
		var table = [];
		tb.querySelectorAll('tr').forEach(function(tr){
			var line = [];
			tr.querySelectorAll('th, td').forEach(function(td){
				line.push(td.innerText);
			});
			table.push(line);
		});
		tables.push(table);
	});
	return tables;
}
