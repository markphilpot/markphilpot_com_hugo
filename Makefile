.PHONY: public css clean clean-hugo all serve start last

public: css bin/hugo-x64
	./bin/hugo-x64

css:
	pnpm css:build

bin/hugo-x64:
	@mkdir -p bin
	@if [ -n "$$NETLIFY_CACHE_DIR" ] && [ -f "$$NETLIFY_CACHE_DIR/hugo-x64" ]; then \
		echo "Restoring hugo-x64 from Netlify cache"; \
		cp "$$NETLIFY_CACHE_DIR/hugo-x64" bin/hugo-x64; \
	else \
		wget -P ./bin https://transfer-markphilpot.s3.amazonaws.com/hugo-x64; \
		if [ -n "$$NETLIFY_CACHE_DIR" ]; then \
			cp bin/hugo-x64 "$$NETLIFY_CACHE_DIR/hugo-x64"; \
		fi; \
	fi
	@chmod +x bin/hugo-x64
	@[ -L bin/hugo ] || ln -s hugo-x64 bin/hugo

bin/hugo:
	wget -P ./bin https://transfer-markphilpot.s3.amazonaws.com/hugo
	chmod +x bin/hugo

clean:
	rm -rf public

clean-hugo:
	rm -f bin/hugo bin/hugo-x64

all:
	./bin/hugo

serve: css
	./bin/hugo serve -D

start:
	zellij --layout ./layout.kdl

min:
	open -a min http://localhost:1313

last:
	@git show --name-only --pretty=format: | grep "\.textbundle/text.md$$" | sed "s/.\{8\}$$//"

last3:
	@git log -n 3 --name-only --pretty=format: | grep "\.textbundle/text.md$$" | sed "s/.\{8\}$$//"

# xpost --preview -l "micro/2025/01/18/fate-strange-fake/"

xpost-last:
	pnpm xpost -l -m -f `git show --name-only --pretty=format: | grep "\.textbundle/text.md$$" | sed "s/.\{8\}$$//"` last

xpost-last-preview:
	pnpm xpost -p -l -m -f `git show --name-only --pretty=format: | grep "\.textbundle/text.md$$" | sed "s/.\{8\}$$//"` last
