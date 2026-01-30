# Dynamic Calendar Icon

A GNOME Shell extension that replaces the GNOME Calendar icon with a dynamic version showing the current day of the month (e.g. 30 for the 30th January).

![Calendar Preview Adwaita](./docs/calendar-preview-adwaita.png)
![Calendar Preview Numix Square](./docs/calendar-preview-numix-square.png)

## Features

- Displays the current day on the Calendar app icon
- Updates automatically at midnight
- Supports different icon themes

## Installation

```bash
make install
```

Then restart GNOME Shell (log out/in on Wayland) and enable:

```bash
gnome-extensions enable calendar-icon@rejnek.cz
```

## Building

```bash
make build   # compile schemas
make zip     # create zip for extensions.gnome.org
make clean   # remove compiled files
```

## Adding Custom Themes

1. Create a new folder inside `icons/`
2. Add 31 SVG icons named `calendar-01.svg` through `calendar-31.svg`
3. The new theme will appear in preferences

## Credits

Included icon themes are from [Numix Project](https://github.com/numixproject):
- [numix-icon-theme-circle](https://github.com/numixproject/numix-icon-theme-circle)
- [numix-icon-theme-square](https://github.com/numixproject/numix-icon-theme-square)

## Known Issues

- The icon updates at midnight based on when the extension was enabled. Timezone or system clock changes won't trigger an update until the next scheduled midnight.

## License

GPL-2.0-or-later
