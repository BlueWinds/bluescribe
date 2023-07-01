# BlueScribe

BlueScribe is an army list builder for tabletop wargames; it is heavily inspired by and 100% compatible with BattleScribe, reading the same format datafiles and writing rosters in the same format.

Try it out at https://bluewinds.github.io/bluescribe/. It loads and runs in a web browser, no installation or downloads needed. For the moment, it is optimized for desktop machines; while it works on a phone, this has not been tested and is probably a bit finicky. There is no server - everything is stored locally on your computer - and other than downloading or updating game systems, it can be run without internet access. For listing and downloading datafiles, BlueScribe uses the https://jsdelivr.net/ CDN.

There is no tracking, no subscription, no paid features. BlueScribe is GNU GPL 3.0 licensed; you can freely distribute and modify it yourself, though of course I appreciate notice and pull requests if you have improvements!

# To build and run

`npm install`
`npm run start`

## Desktop App

To build the desktop app, you will need to install [Rust](https://www.rust-lang.org/tools/install), as well as the [tauri dependencies](https://tauri.app/v1/guides/getting-started/prerequisites/). On Debian-based systems, this looks something like:

```
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# Additional dependencies not listed in tauri that I found necessary
sudo apt-get install javascriptcoregtk-4.1
```

To build the necessary crates for the first time, run `npm run prep_tauri`.

In your development cycle, use `npm run tauri dev`. This launches `npm run start` then runs a native app using that server, so you can hot reload and see your changes in both the browser and the native app simultaneously.

Executables can be built with `npm run tauri build -- -b app`
Packaged installers can be built with `npm run tauri build`
