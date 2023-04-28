package main

import (
	"fmt"
	"strings"

	"github.com/xrash/smetrics"
)

// 定义省市区县信息结构体
type Address struct {
	Province string
	City     string
	District string
	Town     string
	Village  string
}

// 获取两个字符串之间的语义相似度
func getSemanticSimilarity(str1 string, str2 string) float64 {
	return smetrics.JaroWinkler(str1, str2, 0.7, 4)
}

// 匹配地址信息
func matchAddress(addresses []Address, input string) *Address {
	input = strings.TrimSpace(input)
	for _, addr := range addresses {
		// 计算匹配度
		matchStr := fmt.Sprintf("%s%s%s%s%s", addr.Province, addr.City, addr.District, addr.Town, addr.Village)
		matchScore := getSemanticSimilarity(matchStr, input)
		if matchScore > 0.8 {
			return &addr
		}
	}
	return nil
}

func readJson(path string) {

}

func main() {
	// 简单初始化一些测试数据
	addresses := []Address{
		Address{Province: "广东省", City: "广州市", District: "天河区", Town: "林和街道", Village: "华南新村"},
		Address{Province: "广东省", City: "深圳市", District: "福田区", Town: "莲花街道", Village: "园岭社区"},
		Address{Province: "湖南省", City: "长沙市", District: "天心区", Town: "劳动西路街道", Village: "火星社区"},
	}

	// 匹配测试
	input := "广东省广州市华南新村"
	addr := matchAddress(addresses, input)
	if addr != nil {
		fmt.Printf("匹配成功，地址信息为：%s%s%s%s%s\n", addr.Province, addr.City, addr.District, addr.Town, addr.Village)
	} else {
		fmt.Println("未找到匹配的地址")
	}
}
