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
	mkdir -p examples/react-basic/dist/ examples/complex/dist/

	$(browserify) examples/react-basic/app.js \
		-r ./dist/bazooka.js:'bazooka' \
		-r ./examples/react-basic/greeting.js:'greeting' \
		-r ./examples/react-basic/vendor/react.min.js:'react' \
		> examples/react-basic/dist/app.bundle.js

	$(browserify) examples/complex/app.js \
		-r ./dist/bazooka.js:'bazooka' \
		-r ./examples/complex/baz-complex.js:'baz-complex' \
		-r ./examples/complex/baz-logger.js:'baz-logger' \
		> examples/complex/dist/app.bundle.js

test:
	$(karma) start $(karma_conf) --single-run
