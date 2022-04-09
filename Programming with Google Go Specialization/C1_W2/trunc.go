package main

import "fmt"

func trunc() {
	var float_input float64
	var int_output int
	fmt.Scan(&float_input)
	int_output = int(float_input)
	fmt.Print(int_output)
}
