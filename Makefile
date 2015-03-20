bin = $(shell npm bin)
browserify = $(bin)/browserify
derequire = $(bin)/derequire

node_modules = $(shell pwd)/node_modules
karma = $(node_modules)/karma/bin/karma
karma_conf = $(shell pwd)/spec/karma.conf.js

.PHONY: example test dist

dist:
	mkdir -p ./dist
	$(browserify) ./src/main.js --standalone Baz | $(derequire) > ./dist/bazooka.js

example:
	mkdir -p examples/basic/dist/ examples/react-basic/dist/
	$(browserify) examples/basic/app.js -r ./dist/bazooka.js:'bazooka' > examples/basic/dist/app.bundle.js
	$(browserify) examples/react-basic/app.js -r ./dist/bazooka.js:'bazooka' -r ./examples/react-basic/vendor/react.min.js:'react'  > examples/react-basic/dist/app.bundle.js

test:
	$(karma) start $(karma_conf) --single-run
