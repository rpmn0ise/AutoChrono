# AutoChrono

**[🇫🇷 Lire en français](README.fr.md)**

An automatic stopwatch for BeamNG.drive: starts on its own the moment your vehicle moves, plus a virtual timing gate you can drop anywhere to time laps continuously — with best/last lap tracking.

## Features

- **Auto-start** once wheel speed goes above 0.5 m/s (configurable).
- **Stop / Reset always available**, even in auto mode — no need to turn it off.
- **Cumulative distance** tracked below the timer (km, 2 decimals), resets together with it.
- **Double-click** the timer for a quick reset.
- **Timing gate, continuous lap mode**: place a gate in front of your car with one click. The first crossing starts the timer; every crossing after that records the completed lap, updates your best lap if it's faster, and immediately restarts the timer for the next lap — no need to stop between laps.
- **Best lap / last lap** displayed live under the timer.
- **Settings panel** (⚙️ icon): adjust the auto-start speed threshold, gate width, gate placement distance, and the anti-bounce cooldown, all from the UI.
- **Bounded detection zone**: the gate only registers a crossing inside a small 3D box around the visible line (width, height, *and* depth) — it won't false-trigger elsewhere on a looping track.
- **Checkered visual**: the gate is drawn as a ground-level checkered strip with two end poles, snapped to the terrain height where it's placed.
- **Optional keybinds** (Start / Stop / Reset / Toggle auto mode / Place gate / Remove gate), bindable in Options > Controls > General.
- **Visual status indicators**: "AUTO" badge (blue), "GATE" badge (purple) once a gate is placed, and a green/red dot for timer state.

## Installation

1. Download the latest release from [Releases](../../releases) or clone this repo.
2. Drop the zip into your BeamNG.drive `mods` folder (or unzip into `mods/unpacked/`).
3. Launch the game, open the **UI Apps** menu, and enable **AutoChrono**.

## Usage

- The timer starts on its own as soon as you drive (Auto mode is on by default).
- **Stop** and **Reset** work at any time, even with Auto checked.
- Double-click the timer display to reset everything to zero (timer, distance, best/last lap).
- Click **"Placer ligne"** (Place gate) to drop a timing gate in front of your vehicle. Drive off and cross it again: the first crossing starts the timer, every crossing after that closes a lap and starts the next one automatically.
- Check/uncheck **"Ligne"** (Gate) to enable/disable gate-based timing without removing it.
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

## Technical details

- **Auto-start**: based on the native `electrics.wheelspeed` stream, no vehicle Lua required for this part.
- **Keybinds**: a small vehicle-side extension (`lua/vehicle/extensions/autoChrono.lua`) exposes `electrics.values` driven by the keybind actions defined in `lua/ge/extensions/core/input/actions/autoChronoInputs.json`.
- **Timing gate**: an engine-side extension (`lua/ge/extensions/autoChronoGate.lua`) computes the vehicle's position every frame (`onUpdate`) and only registers a crossing inside a bounded local box (width, height, and depth) around the gate — not on an infinite plane or an infinite "tunnel" along the road, which would false-trigger on looping tracks.
- **Ground snapping**: the gate's height is set with a downward raycast (`castRayStatic`) at placement time, so it sits flush on sloped roads instead of floating.
- **Settings**: gate width, placement distance, and cooldown are pushed from the UI to the engine extension via `extensions.autoChronoGate.setSettings(width, offset, cooldown)`.

## Project structure

```
ui/modules/apps/autoChrono/   # UI App (Angular)
lua/vehicle/extensions/       # Keybinds (electrics.values)
lua/ge/extensions/            # Timing gate + keybind actions
```

## License / Credits

100% original mod, created by **rpmn0ise**. No dependency on any other mod.

## Contributing / Bug reports

Issues and pull requests are welcome.
