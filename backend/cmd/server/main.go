package main

import (
	"fmt"
	"log"
	"net/http"

	"backend/internal/tailer"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // let FE to connect
}

func handleWS(w http.ResponseWriter, r *http.Request, logChan chan string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	for msg := range logChan {
		err := conn.WriteMessage(websocket.TextMessage, []byte(msg))
		if err != nil {
			break
		}
	}
}

func main() {
	logChan := make(chan string)

	// Start tailer in background
	go tailer.WatchFile("test.log", logChan)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handleWS(w, r, logChan)
	})

	fmt.Println("Server starting on Windows at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
