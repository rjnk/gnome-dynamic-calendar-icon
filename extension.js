/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const SYSTEM_APPS = '/usr/share/applications';
const USER_APPS = '.local/share/applications';
const CALENDAR_DESKTOP = 'org.gnome.Calendar.desktop';

function setIcon(desktopFile, iconPath) {
    const systemFile = Gio.File.new_for_path(`${SYSTEM_APPS}/${desktopFile}`);
    const extensionFile = Gio.File.new_for_path(
        GLib.build_filenamev([GLib.get_home_dir(), USER_APPS, desktopFile])
    );

    const [, contents] = systemFile.load_contents(null);
    const text = new TextDecoder().decode(contents);
    const modified = text.replace(/^Icon=.*$/m, `Icon=${iconPath}`);

    extensionFile.replace_contents(modified, null, false, Gio.FileCreateFlags.NONE, null);
}

function resetIcon(desktopFile) {
    const extensionFile = Gio.File.new_for_path(
        GLib.build_filenamev([GLib.get_home_dir(), USER_APPS, desktopFile])
    );
    extensionFile.delete(null);
}

export default class CalendarIconExtension extends Extension {
    enable() {
        const iconPath = GLib.build_filenamev([this.path, 'calendar-red-01.svg']);
        setIcon(CALENDAR_DESKTOP, iconPath);
    }

    disable() {
        resetIcon(CALENDAR_DESKTOP);
    }
}
