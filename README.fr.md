# AutoChrono

**[🇬🇧 Read this in English](README.md)**

Chronomètre automatique pour BeamNG.drive : démarre tout seul dès que ton véhicule bouge, avec en plus deux façons de chronométrer des tours — une simple ligne de chronométrage à placer où tu veux, ou un tracé complet à plusieurs checkpoints (placé à la main ou enregistré automatiquement en roulant, puis exportable/importable sous forme de fichier) — avec suivi du meilleur/dernier tour dans les deux cas.

## Fonctionnalités

### Chronomètre
- **Démarrage automatique** dès que la vitesse des roues dépasse 0.5 m/s (réglable).
- **Stop / Reset toujours accessibles**, même en mode auto — pas besoin de le désactiver.
- **Distance cumulée** affichée en dessous du chrono (km, 2 décimales), réinitialisée avec lui.
- **Double-clic** sur le chrono = reset rapide.

### Ligne de chronométrage ("Ligne")
- Place une ligne devant ton véhicule d'un clic. Le premier passage démarre le chrono ; chaque passage suivant enregistre le tour qui vient de se terminer, met à jour le meilleur temps si besoin, puis enchaîne directement sur le tour suivant — pas besoin de t'arrêter entre deux tours.
- **Zone de détection bornée** : le franchissement n'est comptabilisé que dans une petite boîte 3D autour de la ligne visible (largeur, hauteur, *et* profondeur) — pas de faux déclenchement ailleurs sur un circuit qui boucle.
- **Rendu visuel damier** : la ligne est dessinée comme une bande damier au sol avec deux poteaux d'extrémité, calée sur la hauteur du terrain à l'endroit où elle est posée.
- Coche/décoche **"Ligne"** pour activer/désactiver le chronométrage par ligne sans la supprimer.

### Mode Tracé — parcours à plusieurs checkpoints
- Construis un parcours complet avec plusieurs checkpoints au lieu d'une simple ligne : **place les checkpoints à la main** au fur et à mesure, ou **enregistre automatiquement** en roulant (un checkpoint est posé environ tous les 15 m).
- Le tout premier checkpoint fait aussi office de ligne de départ/arrivée et réutilise la même ligne physique que la fonctionnalité "Ligne" ci-dessus.
- **Affichage de la progression** en direct ("Checkpoint 3 / 8") pendant que tu roules sur le parcours.
- **Export / import sous forme de fichier** : sauvegarde un tracé terminé sur le disque et recharge-le plus tard, ou partage-le avec quelqu'un d'autre — l'application vérifie que le fichier correspond bien à la carte actuelle avant de le charger, et rejette les fichiers corrompus ou invalides avec un message clair plutôt qu'un échec silencieux.
- **"Ligne" et "Tracé" sont mutuellement exclusifs** : un seul des deux pilote le chrono à la fois, pour qu'un passage ne soit jamais compté deux fois. Finaliser un nouveau tracé bascule automatiquement l'application en mode Tracé.

### Commun
- **Meilleur tour / dernier tour** affichés en direct sous le chrono, dans les deux modes de chronométrage.
- **Panneau de réglages** (icône ⚙️) : ajuste le seuil de vitesse du démarrage auto, la largeur de la ligne, la distance de placement, et le délai anti-rebond, directement depuis l'UI.
- **Raccourcis clavier optionnels** (Start / Stop / Reset / Toggle mode auto / Placer ligne / Supprimer ligne), à assigner dans Options > Contrôles > Général.
- **Indicateurs visuels** : badge "AUTO" (bleu), badge "LIGNE" (violet) quand une ligne est placée, badge "TRACÉ" (orange) quand un tracé est prêt, et point vert/rouge pour l'état du chrono.

## Installation

1. Télécharge la dernière version depuis [Releases](../../releases) ou clone ce dépôt.
2. Dépose le zip dans le dossier `mods` de BeamNG.drive (ou décompresse dans `mods/unpacked/`).
3. Lance le jeu, ouvre le menu **UI Apps** et active **AutoChrono**.

## Utilisation

### Chronomètre & ligne de chronométrage
- Le chrono démarre tout seul dès que tu roules (mode Auto activé par défaut).
- **Stop** et **Reset** fonctionnent à tout moment, même avec Auto coché.
- Double-clique sur l'affichage du chrono pour tout remettre à zéro (chrono, distance, meilleur/dernier tour).
- Clique sur **"Placer ligne"** pour poser une ligne de chronométrage devant ton véhicule. Repars et reviens la franchir : le premier passage démarre le chrono, chaque passage suivant boucle un tour et enchaîne directement sur le suivant.
- Coche/décoche **"Ligne"** pour activer/désactiver le chronométrage par ligne sans la supprimer.

### Mode Tracé
- Ouvre le panneau Tracé et place des checkpoints à la main en roulant, ou lance l'enregistrement automatique — un checkpoint est ajouté environ tous les 15 m.
- Repasse sur la ligne de départ/arrivée pour arrêter l'enregistrement, donne un nom au tracé et clique sur **"Finaliser"** une fois au moins 3 checkpoints posés. L'application bascule automatiquement en mode Tracé.
- Une fois le tracé actif, franchis la ligne de départ/arrivée pour démarrer puis boucler un tour ; le compteur de checkpoints affiche ta progression entre les deux.
- Utilise **"Exporter"** pour sauvegarder le tracé actuel dans un fichier, et le menu déroulant + **"Charger"** pour en recharger un précédemment exporté (seuls les tracés correspondant à la carte actuelle sont acceptés).
- **"Effacer le tracé"** supprime le tracé en cours et sa ligne, et repasse l'application en mode Ligne simple.

### Réglages
- Clique sur l'icône **⚙️** pour ouvrir le panneau de réglages et ajuster le seuil de vitesse, la largeur de ligne, la distance de placement et le cooldown, puis clique sur **Appliquer**.

### Raccourcis clavier (optionnels)

Aucun raccourci n'est assigné par défaut. Pour en configurer :

`Options > Contrôles > Général`, recherche "AutoChrono" :

| Action | Description |
|---|---|
| AutoChrono : Start | Démarre le chrono |
| AutoChrono : Pause | Met le chrono en pause |
| AutoChrono : Reset | Réinitialise chrono + distance + tours |
| AutoChrono : Mode auto | Active/désactive le démarrage automatique |
| AutoChrono : Placer ligne | Place la ligne devant le véhicule |
| AutoChrono : Supprimer ligne | Supprime la ligne actuelle |

Il n'y a pour l'instant pas de raccourcis dédiés au mode Tracé (enregistrement, placement de checkpoints, finalisation, import/export) : ces actions passent par le panneau de l'application.

## Détails techniques

- **Démarrage auto** : basé sur le stream natif `electrics.wheelspeed`, aucun Lua véhicule requis pour cette partie.
- **Raccourcis clavier** : petite extension véhicule (`lua/vehicle/extensions/autoChrono.lua`) qui expose des `electrics.values` pilotées par les actions clavier définies dans `lua/ge/extensions/core/input/actions/autoChronoInputs.json`.
- **Ligne de chronométrage** : extension moteur (`lua/ge/extensions/autoChronoGate.lua`) qui calcule la position du véhicule à chaque frame (`onUpdate`) et ne comptabilise un franchissement que dans une boîte locale bornée (largeur, hauteur et profondeur) autour de la ligne — pas sur un plan infini, ni sur un "tunnel" infini le long de la route qui se déclencherait à tort sur un circuit qui boucle.
- **Mode Tracé** : une seconde extension moteur (`lua/ge/extensions/autoChronoTrack.lua`) gère la liste des checkpoints, l'enregistrement, ainsi que l'export/import JSON (fichiers écrits dans `mods/autochrono_tracks/`), et partage la même ligne physique que l'extension de chronométrage pour le départ/arrivée. Le tracé est rendu via `core_groundMarkers` (natif au jeu), avec un rendu de secours plus simple si cette API n'est pas disponible.
- **Calage au sol** : la hauteur de la ligne est fixée via un raycast vers le bas (`castRayStatic`) au moment du placement, pour qu'elle reste plaquée au sol sur une route en pente au lieu de flotter.
- **Réglages** : la largeur de ligne, la distance de placement et le cooldown sont envoyés de l'UI vers l'extension moteur via `extensions.autoChronoGate.setSettings(width, offset, cooldown)`.

## Structure du projet

```
ui/modules/apps/autoChrono/   # UI App (Angular)
lua/vehicle/extensions/       # Raccourcis clavier (electrics.values)
lua/ge/extensions/            # Ligne de chronométrage, mode Tracé, actions clavier
mods/autochrono_tracks/       # Tracés exportés (créé au premier export)
```

## Licence / Crédits

Mod 100% original, créé par **rpmn0ise**. Aucune dépendance à un autre mod.

## Contribuer / Signaler un bug

Les issues et pull requests sont les bienvenues.
