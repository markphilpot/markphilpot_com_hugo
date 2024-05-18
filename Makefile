.PHONY: public clean all serve start

clean:
	rm -rf public

all:
	hugo

serve:
	hugo serve -D

start:
	zellij --layout ./layout.kdl