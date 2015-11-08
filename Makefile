bin = $(shell npm bin)
jsdoc2md = $(bin)/jsdoc2md

node_modules = $(shell pwd)/node_modules
karma = $(node_modules)/karma/bin/karma
karma_conf = $(shell pwd)/spec/karma.conf.js
webpack = $(node_modules)/webpack/bin/webpack.js

.PHONY: example test

example:
	$(webpack) --config=webpack.config.example.js

test:
	$(karma) start $(karma_conf) --single-run

docs: src/main.js
	mkdir -p ./docs
	$(jsdoc2md) src/main.js > ./docs/README.md
