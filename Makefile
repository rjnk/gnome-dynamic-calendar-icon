UUID = calendar-icon@rejnek.cz

build:
	glib-compile-schemas schemas/

zip: build
	@rm -f $(UUID).zip
	zip -r $(UUID).zip icons schemas metadata.json extension.js prefs.js

install: zip
	gnome-extensions install --force $(UUID).zip

clean:
	rm -f schemas/gschemas.compiled $(UUID).zip

.PHONY: build install zip clean
