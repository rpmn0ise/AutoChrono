# AutoChrono

**[🇫🇷 Lire en français](README.fr.md)**

An automatic stopwatch for BeamNG.drive: starts on its own the moment your vehicle moves, plus two ways to time laps — a simple timing gate you can drop anywhere, or a full multi-checkpoint track (placed by hand or recorded automatically as you drive, then exported/imported as a file) — with best/last lap tracking either way.

## Features

### Stopwatch
- **Auto-start** once wheel speed goes above 0.5 m/s (configurable).
- **Stop / Reset always available**, even in auto mode — no need to turn it off.
- **Cumulative distance** tracked below the timer (km, 2 decimals), resets together with it.
- **Double-click** the timer for a quick reset.

### Timing gate ("Ligne")
- Place a gate in front of your car with one click. The first crossing starts the timer; every crossing after that records the completed lap, updates your best lap if it's faster, and immediately restarts the timer for the next lap — no need to stop between laps.
- **Bounded detection zone**: the gate only registers a crossing inside a small 3D box around the visible line (width, height, *and* depth) — it won't false-trigger elsewhere on a looping track.
- **Checkered visual**: the gate is drawn as a ground-level checkered strip with two end poles, snapped to the terrain height where it's placed.
- Check/uncheck **"Ligne"** to enable or disable gate-based timing without removing the gate.

### Track mode ("Tracé") — multi-checkpoint courses
- Build a full course with several checkpoints instead of a single line: **place checkpoints manually** as you go, or **record automatically** while driving (a checkpoint is dropped roughly every 15 m).
- The very first checkpoint doubles as the start/finish line and reuses the same physical gate as the simple timing-gate feature above.
- Live **progress display** ("Checkpoint 3 / 8") while you drive the course.
- **Export / import as a file**: save a finished track to disk and reload it later, or share it with someone else — the app checks the file matches the current map before loading it, and rejects corrupted or invalid files with a clear message instead of failing silently.
- "Ligne" and "Tracé" are **mutually exclusive**: only one of the two drives the stopwatch at a time, so crossings never get counted twice. Finalizing a new track automatically switches the app into Track mode.

### Common
- **Best lap / last lap** displayed live under the timer, for both timing modes.
- **Settings panel** (⚙️ icon): adjust the auto-start speed threshold, gate width, gate placement distance, and the anti-bounce cooldown, all from the UI.
- **Optional keybinds** (Start / Stop / Reset / Toggle auto mode / Place gate / Remove gate), bindable in Options > Controls > General.
- **Visual status indicators**: "AUTO" badge (blue), "GATE" badge (purple) once a gate is placed, "TRACK" badge (orange) once a track is ready, and a green/red dot for timer state.

## Installation

1. Download the latest release from [Releases](../../releases) or clone this repo.
2. Drop the zip into your BeamNG.drive `mods` folder (or unzip into `mods/unpacked/`).
3. Launch the game, open the **UI Apps** menu, and enable **AutoChrono**.

## Usage

### Stopwatch & timing gate
- The timer starts on its own as soon as you drive (Auto mode is on by default).
- **Stop** and **Reset** work at any time, even with Auto checked.
- Double-click the timer display to reset everything to zero (timer, distance, best/last lap).
- Click **"Placer ligne"** (Place gate) to drop a timing gate in front of your vehicle. Drive off and cross it again: the first crossing starts the timer, every crossing after that closes a lap and starts the next one automatically.
- Check/uncheck **"Ligne"** (Gate) to enable/disable gate-based timing without removing it.

### Track mode
- Open the track panel and either place checkpoints manually as you drive, or start automatic recording — a checkpoint is added roughly every 15 m.
- Drive back over the start/finish line to stop recording, give the track a name, and hit **"Finaliser"** (Finalize) once you have at least 3 checkpoints. The app switches to Track mode automatically.
- While a track is active, cross the start/finish line to start a lap and complete one; the checkpoint counter shows your progress in between.
- Use **"Exporter"** (Export) to save the current track as a file, and the dropdown + **"Charger"** (Load) to reload one previously exported (only tracks matching the current map are accepted).
- **"Effacer le tracé"** (Clear track) removes the current track and its gate, and switches the app back to simple Gate mode.

### Settings
- Click the **⚙️** icon to open the settings panel and adjust the speed threshold, gate width, placement distance, and cooldown, then hit **Apply**.

### Keybinds (optional)

No keybind is assigned by default. To set them up:

`Options > Controls > General`, search for "AutoChrono":

| Action | Description |
|---|---|
| AutoChrono : Start | Starts the timer |
| AutoChrono : Pause | Pauses the timer |
| AutoChrono : Reset | Resets timer + distance + laps |
| AutoChrono : Mode auto | Toggles auto-start on/off |
| AutoChrono : Placer ligne | Places the gate in front of the vehicle |
| AutoChrono : Supprimer ligne | Removes the current gate |

There are currently no dedicated keybinds for Track mode (recording, placing checkpoints, finalizing, import/export) — those are handled from the app's UI panel.

## Technical details

- **Auto-start**: based on the native `electrics.wheelspeed` stream, no vehicle Lua required for this part.
- **Keybinds**: a small vehicle-side extension (`lua/vehicle/extensions/autoChrono.lua`) exposes `electrics.values` driven by the keybind actions defined in `lua/ge/extensions/core/input/actions/autoChronoInputs.json`.
- **Timing gate**: an engine-side extension (`lua/ge/extensions/autoChronoGate.lua`) computes the vehicle's position every frame (`onUpdate`) and only registers a crossing inside a bounded local box (width, height, and depth) around the gate — not on an infinite plane or an infinite "tunnel" along the road, which would false-trigger on looping tracks.
- **Track mode**: a second engine-side extension (`lua/ge/extensions/autoChronoTrack.lua`) manages the list of checkpoints, recording, and JSON export/import (files are written to `mods/autochrono_tracks/`), and shares the same physical gate as the timing-gate extension for the start/finish line. Course markers are rendered through the game's native `core_groundMarkers`, with a simpler debug-draw fallback if that API isn't available.
- **Ground snapping**: the gate's height is set with a downward raycast (`castRayStatic`) at placement time, so it sits flush on sloped roads instead of floating.
- **Settings**: gate width, placement distance, and cooldown are pushed from the UI to the engine extension via `extensions.autoChronoGate.setSettings(width, offset, cooldown)`.

## Project structure

```
ui/modules/apps/autoChrono/   # UI App (Angular)
lua/vehicle/extensions/       # Keybinds (electrics.values)
lua/ge/extensions/            # Timing gate, track mode, and keybind actions
mods/autochrono_tracks/       # Exported track files (created on first export)
```

## License / Credits

100% original mod, created by **rpmn0ise**. No dependency on any other mod.

## Contributing / Bug reports

Issues and pull requests are welcome.
