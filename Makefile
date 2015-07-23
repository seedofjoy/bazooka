bin = $(shell npm bin)
browserify = $(bin)/browserify
derequire = $(bin)/derequire
jsdoc2md = $(bin)/jsdoc2md
uglifyjs = $(bin)/uglifyjs

node_modules = $(shell pwd)/node_modules
karma = $(node_modules)/karma/bin/karma
karma_conf = $(shell pwd)/spec/karma.conf.js

.PHONY: example test dist

dist:
	mkdir -p ./dist
	$(browserify) ./src/main.js --standalone Baz | $(derequire) \
		| tee ./dist/bazooka.js \
		| $(uglifyjs) --mangle \
		> ./dist/bazooka.min.js

example:
	mkdir -p examples/react-basic/dist/ examples/complex/dist/ examples/gifflix/dist/

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

	$(browserify) examples/gifflix/app.js \
		-r ./dist/bazooka.js:'bazooka' \
		-r ./examples/gifflix/star.js:'star' \
		-r ./examples/gifflix/counter.js:'counter' \
		-r ./examples/gifflix/vendor/kefir.min.js:'kefir' \
		> examples/gifflix/dist/app.bundle.js

test:
	$(karma) start $(karma_conf) --single-run

docs: src/main.js
	mkdir -p ./docs
	$(jsdoc2md) src/main.js > ./docs/README.md
