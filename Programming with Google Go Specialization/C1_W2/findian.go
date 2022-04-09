package main

import (
	"fmt"
	"strings"
)

func findian() {
	var input string
	fmt.Scan(&input)
	if strings.Contains(strings.ToLower(input), "ian") {
		fmt.Printf("Found!")
	} else {
		fmt.Printf("Not Found!")
	}
}
