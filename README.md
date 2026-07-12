# AutoChrono

**[🇫🇷 Lire en français](README.fr.md)**

An automatic stopwatch for BeamNG.drive: starts on its own the moment your vehicle moves, plus a virtual timing gate you can drop anywhere to time a lap.

## Features

- **Auto-start** once wheel speed goes above 0.5 m/s.
- **Stop / Reset always available**, even in auto mode — no need to turn it off.
- **Cumulative distance** tracked below the timer (km, 2 decimals), resets together with it.
- **Double-click** the timer for a quick reset.
- **Timing gate**: place a gate in front of your car with one click. Crossing it inside the drawn rectangle toggles start/stop automatically (perfect for lap timing). Detection is bounded to the visible rectangle — not an infinite plane cutting across the whole map.
- **Optional keybinds** (Start / Stop / Reset / Toggle auto mode / Place gate / Remove gate), bindable in Options > Controls > General.
- **Visual status indicators**: "AUTO" badge (blue), "GATE" badge (purple) once a gate is placed, and a green/red dot for timer state.

## Installation

1. Download the latest release from [Releases](../../releases) or clone this repo.
2. Drop the zip into your BeamNG.drive `mods` folder (or unzip into `mods/unpacked/`).
3. Launch the game, open the **UI Apps** menu, and enable **AutoChrono**.

## Usage

- The timer starts on its own as soon as you drive (Auto mode is on by default).
- **Stop** and **Reset** work at any time, even with Auto checked.
- Double-click the timer display to reset everything to zero.
- Click **"Placer ligne"** to place a timing gate in front of your vehicle. Drive off, do your lap, come back and cross it: the timer starts on the first crossing and stops on the second.
- Check/uncheck **"Ligne"** to enable/disable the gate without removing it.

### Keybinds (optional)

No keybind is assigned by default. To set them up:

`Options > Controls > General`, search for "AutoChrono":

| Action | Description |
|---|---|
| AutoChrono : Start | Starts the timer |
| AutoChrono : Pause | Pauses the timer |
| AutoChrono : Reset | Resets timer + distance |
| AutoChrono : Mode auto | Toggles auto-start on/off |
| AutoChrono : Placer ligne | Places the gate in front of the vehicle |
| AutoChrono : Supprimer ligne | Removes the current gate |

## Technical details

- **Auto-start**: based on the native `electrics.wheelspeed` stream, no vehicle Lua required for this part.
- **Keybinds**: a small vehicle-side extension (`lua/vehicle/extensions/autoChrono.lua`) exposes `electrics.values` driven by the keybind actions defined in `lua/ge/extensions/core/input/actions/autoChronoInputs.json`.
- **Timing gate**: an engine-side extension (`lua/ge/extensions/autoChronoGate.lua`) computes the vehicle's position every frame (`onUpdate`) and detects crossings only within the bounds of the drawn rectangle (width/height), not on an infinite plane.

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
