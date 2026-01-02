objects = js/search.js css/booklit.css css/blog.css css/prism.css css/pipeline.css

all: $(objects)

.PHONY: clean

clean:
	rm -f $(objects)

js/search.js: elm/Search.elm
	yarn run elm make --output $@ $^

css/booklit.css: less/booklit.less less/*.less
	yarn run lessc $< $@

css/blog.css: less/blog.less less/*.less
	yarn run lessc $< $@

css/prism.css: less/prism.less less/*.less
	yarn run lessc $< $@

css/pipeline.css: less/pipeline.less
	yarn run lessc $< $@
