bin = $(shell npm bin)
browserify = $(bin)/browserify

example:
	$(browserify) examples/app.js -r ./src/main.js:rocketLauncher > examples/app.bundle.js
