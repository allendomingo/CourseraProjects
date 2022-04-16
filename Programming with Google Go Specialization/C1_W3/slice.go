package main

import (
	"fmt"
	"sort"
	"strconv"
)

func slice() {
	var input string
	var num_slice = make([]int, 0)

	fmt.Scan(&input)
	fmt.Println(input)
	for input != "x" {
		fmt.Println(input)
		parsed_input, _ := strconv.ParseInt(input, 10, 32)
		num_slice = append(num_slice, int(parsed_input))
		sort.Ints(num_slice)
		fmt.Println(num_slice)
		fmt.Scan(&input)
	}
}
