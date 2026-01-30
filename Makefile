UUID = calendar-icon@rejnek.cz
INSTALL_DIR = ~/.local/share/gnome-shell/extensions/$(UUID)

build:
	glib-compile-schemas schemas/

install: build
	mkdir -p $(INSTALL_DIR)
	cp -r icons schemas metadata.json extension.js prefs.js $(INSTALL_DIR)/

zip: build
	zip -r $(UUID).zip icons schemas metadata.json extension.js prefs.js README.md

clean:
	rm -f schemas/gschemas.compiled $(UUID).zip

.PHONY: build install zip clean
