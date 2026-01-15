package tailer

import (
	"bufio"
	"io"
	"os"
	"time"
)

func WatchFile(filePath string, lines chan<- string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	file.Seek(0, io.SeekEnd)
	reader := bufio.NewReader(file)

	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {

				time.Sleep(500 * time.Millisecond)
				continue
			}
			return err
		}

		lines <- line
	}
}
