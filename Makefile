.PHONY: public clean clean-hugo all serve start

public: bin/hugo-x64
	./bin/hugo-x64

bin/hugo-x64:
	wget -P ./bin https://transfer-markphilpot.s3.amazonaws.com/hugo-x64
	chmod +x bin/hugo-x64
	ln -s hugo-x64 hugo

bin/hugo:
	wget -P ./bin https://transfer-markphilpot.s3.amazonaws.com/hugo
	chmod +x bin/hugo

clean:
	rm -rf public

clean-hugo:
	rm -f bin/hugo bin/hugo-x64

all: bin/hugo
	./bin/hugo

serve: bin/hugo
	./bin/hugo serve -D

start:
	zellij --layout ./layout.kdl