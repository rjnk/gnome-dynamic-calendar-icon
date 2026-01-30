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

function getCurrentIcon() {
    const now = GLib.DateTime.new_now_local();
    const dayStr = now.get_day_of_month().toString().padStart(2, '0');
    return `calendar-${dayStr}.svg`;
}

function getSecondsUntilMidnight() {
    const now = GLib.DateTime.new_now_local();
    return 86400 - (now.get_hour() * 3600 + now.get_minute() * 60 + now.get_second());
}

function setIcon(desktopFile, iconPath) {
    const systemFile = Gio.File.new_for_path(`${SYSTEM_APPS}/${desktopFile}`);
    const extensionFile = Gio.File.new_for_path(
        GLib.build_filenamev([GLib.get_home_dir(), USER_APPS, desktopFile])
    );

    let contents;
    try {
        [, contents] = systemFile.load_contents(null);
    } catch (e) {
        console.error(`Calendar Icon: ${desktopFile} not found, is GNOME Calendar installed?`);
        return;
    }

    const text = new TextDecoder().decode(contents);
    const modified = text.replace(/^Icon=.*$/m, `Icon=${iconPath}`);
    extensionFile.replace_contents(modified, null, false, Gio.FileCreateFlags.NONE, null);
}

function resetIcon(desktopFile) {
    const extensionFile = Gio.File.new_for_path(
        GLib.build_filenamev([GLib.get_home_dir(), USER_APPS, desktopFile])
    );
    try {
        extensionFile.delete(null);
    } catch (e) {
        // File may not exist if setIcon() failed (e.g., GNOME Calendar not installed)
    }
}

export default class CalendarIconExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._settingsChangedId = this._settings.connect('changed::icon-theme', () => {
            this._updateIcon();
        });
        this._updateIcon();
        this._startTimer();
    }

    disable() {
        if (this._timerId) {
            GLib.source_remove(this._timerId);
            this._timerId = null;
        }
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        this._settings = null;
        resetIcon(CALENDAR_DESKTOP);
    }

    _updateIcon() {
        const theme = this._settings.get_string('icon-theme');
        const iconPath = GLib.build_filenamev([this.path, 'icons', theme, getCurrentIcon()]);
        setIcon(CALENDAR_DESKTOP, iconPath);
    }

    _startTimer() {
        this._timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, getSecondsUntilMidnight(), () => {
            this._updateIcon();
            this._timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 86400, () => {
                this._updateIcon();
                return GLib.SOURCE_CONTINUE;
            });
            return GLib.SOURCE_REMOVE;
        });
    }
}
