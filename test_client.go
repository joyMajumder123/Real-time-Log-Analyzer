package main

import (
	"fmt"
	"io"
	"net/http"
	"time"
)

func main() {
	// Wait for server to start
	time.Sleep(1 * time.Second)

	fmt.Println("=== TEST 1: Health Check ===")
	resp, err := http.Get("http://127.0.0.1:8080/health")
	if err != nil {
		fmt.Printf("✗ Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Printf("✓ Status: %d\n", resp.StatusCode)
	fmt.Printf("✓ Body: %s\n", string(body))
}
