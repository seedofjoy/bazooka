bin = $(shell npm bin)
browserify = $(bin)/browserify

example:
	$(browserify) examples/app.js -r ./src/main.js:'rocket-launcher' > examples/app.bundle.js
