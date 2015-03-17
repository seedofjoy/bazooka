bin = $(shell npm bin)
browserify = $(bin)/browserify
derequire = $(bin)/derequire

node_modules = $(shell pwd)/node_modules
karma = $(node_modules)/karma/bin/karma
karma_conf = $(shell pwd)/spec/karma.conf.js

.PHONY: example test dist

dist:
	$(browserify) ./src/main.js --standalone Baz | $(derequire) > ./dist/bazooka.js

example:
	$(browserify) examples/app.js -r ./dist/bazooka.js:'bazooka' > examples/app.bundle.js

test:
	$(karma) start $(karma_conf) --single-run
