
JADE = ./node_modules/.bin/jade

HTML = index.html api.html guide.html

docs: $(HTML)

%.html: %.jade includes/*.jade en/guide/*.jade en/api/*.jade
	$(JADE) --path $< < $< > $@

clean:
	rm -f *.html

.PHONY: docs clean
