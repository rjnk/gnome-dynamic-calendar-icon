import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

function getAvailableThemes(iconsPath) {
    const dir = Gio.File.new_for_path(iconsPath);
    const enumerator = dir.enumerate_children('standard::name,standard::type', Gio.FileQueryInfoFlags.NONE, null);
    const themes = [];

    let info;
    while ((info = enumerator.next_file(null))) {
        if (info.get_file_type() === Gio.FileType.DIRECTORY)
            themes.push(info.get_name());
    }

    return themes.sort();
}

export default class CalendarIconPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const themes = getAvailableThemes(`${this.path}/icons`);

        const row = new Adw.ComboRow({title: 'Theme'});
        row.set_model(Gtk.StringList.new(themes));
        row.set_selected(Math.max(0, themes.indexOf(settings.get_string('icon-theme'))));
        row.connect('notify::selected', () => {
            settings.set_string('icon-theme', themes[row.get_selected()]);
        });

        const group = new Adw.PreferencesGroup({title: 'Icon Theme'});
        group.add(row);

        const page = new Adw.PreferencesPage();
        page.add(group);

        window.add(page);
    }
}
