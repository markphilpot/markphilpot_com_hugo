
public: bin/hugo
	./bin/hugo

bin/hugo:
	wget -P ./bin https://transfer-markphilpot.s3.amazonaws.com/hugo
	chmod +x bin/hugo

clean:
	rm -rf public

clean-hugo:
	rm -f bin/hugo