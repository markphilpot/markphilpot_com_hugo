
public: bin/hugo-x64
	./bin/hugo-x64

bin/hugo-x64:
	wget -P ./bin https://transfer-markphilpot.s3.amazonaws.com/hugo-x64
	chmod +x bin/hugo-x64

clean:
	rm -rf public

clean-hugo:
	rm -f bin/hugo