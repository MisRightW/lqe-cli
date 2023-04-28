import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'

class ArrayStack {
    constructor() {
        this.data = [];
    }
    size() {
        return this.data.length;
    }
    isEmpty() {
        return this.data.length === 0;
    }
    push(e) {
        this.data.push(e);
    }
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        return this.data.pop();
    }
    top() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        return this.data[this.size()-1];
    }
}

async function getPageContent(url) {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        }
    } catch(error) {
        console.error(`Failed to fetch page content from ${url}: ${error}`);
    }
}

function parseDistrictData(items) {
    const stack = new ArrayStack();
    const data = {};

    let pro = '';
    let city = '';

    for (let i=0; i<items.length; i++) {
        const sp = cheerio.load(items[i], {normalizeWhitespace: true});
        const span = sp('span');
        const value = sp.text().trim();

        if (!value) {
            continue;
        }

        stack.push(value);

        if (stack.size() < 2) {
            continue;
        }

        if (span && span.text().length === 1) {
            // 市级
            const name = value;
            city = stack.pop();
            data[pro + name] = stack.pop();
        } else if (span && span.text().length === 3) {
            // 县级
            const name = value;
            stack.pop();
            data[pro + city + name] = stack.pop();
        } else {
            // 省级
            const name = value;
            pro = stack.pop();
            data[name] = stack.pop();
        }
    }

    return data;
}

function saveDictToFile(data, filename) {
    fs.writeFile(filename, JSON.stringify(data, null, 4), 'utf8', function(err) {
        if (err) {
            console.error(`Failed to write data to file ${filename}: ${err}`);
        } else {
            console.log(`Data saved to file ${filename}`);
        }
    });
}

async function main() {
    const url = "https://www.mca.gov.cn/article/sj/xzqh/2022/202201xzqh.html";
    try {
        const html = await getPageContent(url);
        const items = cheerio.load(html, {normalizeWhitespace: true})('td.xl7032365,td.xl7132365');
        const data = parseDistrictData(items);
        saveDictToFile(data, 'district_data2.json');
        console.log(data);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

main();
