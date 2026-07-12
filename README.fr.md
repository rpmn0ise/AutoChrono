# AutoChrono

**[🇬🇧 Read this in English](README.md)**

Chronomètre automatique pour BeamNG.drive : démarre tout seul dès que ton véhicule bouge, avec en plus une ligne de chronométrage virtuelle à placer où tu veux pour chronométrer un tour de circuit.

![Ligne de chronométrage placée sur circuit](docs/image-2-gate-on-track.png)

## Fonctionnalités

- **Démarrage automatique** dès que la vitesse des roues dépasse 0.5 m/s.
- **Stop / Reset toujours accessibles**, même en mode auto — pas besoin de le désactiver.
- **Distance cumulée** affichée en dessous du chrono (km, 2 décimales), réinitialisée avec lui.
- **Double-clic** sur le chrono = reset rapide.
- **Ligne de chronométrage** : place une ligne devant ton véhicule d'un clic. Chaque passage dans la zone délimitée bascule automatiquement start/stop (parfait pour un tour de circuit chronométré). La détection est limitée au rectangle visuel dessiné — pas de plan infini qui couperait toute la carte.
- **Raccourcis clavier optionnels** (Start / Stop / Reset / Toggle mode auto / Placer ligne / Supprimer ligne), à assigner dans Options > Contrôles > Général.
- **Indicateurs visuels** : badge "AUTO" (bleu), badge "LIGNE" (violet) quand une ligne est placée, et point vert/rouge pour l'état du chrono.

## Installation

1. Télécharge la dernière version depuis [Releases](../../releases) ou clone ce dépôt.
2. Dépose le zip dans le dossier `mods` de BeamNG.drive (ou décompresse dans `mods/unpacked/`).
3. Lance le jeu, ouvre le menu **UI Apps** et active **AutoChrono**.

## Utilisation

- Le chrono démarre tout seul dès que tu roules (mode Auto activé par défaut).
- **Stop** et **Reset** fonctionnent à tout moment, même avec Auto coché.
- Double-clique sur l'affichage du chrono pour tout remettre à zéro.
- Clique sur **"Placer ligne"** pour poser une ligne de chronométrage devant ton véhicule. Repars, fais ton tour, reviens la franchir : le chrono démarre au premier passage et s'arrête au second.
- Coche/décoche **"Ligne"** pour activer/désactiver la ligne sans la supprimer.

### Raccourcis clavier (optionnels)

Aucun raccourci n'est assigné par défaut. Pour en configurer :

`Options > Contrôles > Général`, recherche "AutoChrono" :

| Action | Description |
|---|---|
| AutoChrono : Start | Démarre le chrono |
| AutoChrono : Pause | Met le chrono en pause |
| AutoChrono : Reset | Réinitialise chrono + distance |
| AutoChrono : Mode auto | Active/désactive le démarrage automatique |
| AutoChrono : Placer ligne | Place la ligne devant le véhicule |
| AutoChrono : Supprimer ligne | Supprime la ligne actuelle |

## Détails techniques

- **Démarrage auto** : basé sur le stream natif `electrics.wheelspeed`, aucun Lua véhicule requis pour cette partie.
- **Raccourcis clavier** : petite extension véhicule (`lua/vehicle/extensions/autoChrono.lua`) qui expose des `electrics.values` pilotées par les actions clavier définies dans `lua/ge/extensions/core/input/actions/autoChronoInputs.json`.
- **Ligne de chronométrage** : extension moteur (`lua/ge/extensions/autoChronoGate.lua`) qui calcule la position du véhicule à chaque frame (`onUpdate`) et détecte le franchissement dans les limites du rectangle dessiné (largeur/hauteur), pas sur un plan infini.

## Structure du projet

```
ui/modules/apps/autoChrono/   # UI App (Angular)
lua/vehicle/extensions/       # Raccourcis clavier (electrics.values)
lua/ge/extensions/            # Ligne de chronométrage + actions clavier
```

## Licence / Crédits

Mod 100% original, créé par **rpmn0ise**. Aucune dépendance à un autre mod.

## Contribuer / Signaler un bug

Les issues et pull requests sont les bienvenues.
