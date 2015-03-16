bin = $(shell npm bin)
browserify = $(bin)/browserify

node_modules = $(shell pwd)/node_modules
karma = $(node_modules)/karma/bin/karma
karma_conf = $(shell pwd)/spec/karma.conf.js

.PHONY: example test

example:
	$(browserify) examples/app.js -r ./src/main.js:'rocket-launcher' > examples/app.bundle.js

test:
	$(karma) start $(karma_conf) --single-run
