// AutoChrono - UI App pour BeamNG.drive
// Auteur : rpmn0ise
// Version : 1.3
// Description : le chrono demarre automatiquement des que le vehicule bouge
//               (via electrics.wheelspeed, stream natif du jeu). Stop et Reset
//               restent toujours pilotables manuellement (boutons ou raccourcis),
//               sans avoir a desactiver le mode auto. Distance cumulee integree
//               en parallele. Mode "ligne" : place une ligne de chronometrage
//               devant le vehicule (lua/ge/extensions/autoChronoGate.lua) et
//               alterne start/stop a chaque franchissement (tour chronometre).
//               Mod 100% original, aucune dependance a un autre mod.
angular.module('beamng.apps')

// Convertit un nombre de secondes en chaine "MM:SS.mmm"
.filter('secondsToDateTime', function() {
  return function(seconds) {
    var minutes = Math.floor(seconds / 60);
    var secondsRemainder = seconds % 60;
    var milliseconds = Math.floor((seconds - Math.floor(seconds)) * 1000).toString();
    milliseconds = "000".substr(0, 3 - milliseconds.length) + milliseconds;
    secondsRemainder = "0" + (secondsRemainder < 10 ? '0' : '') + secondsRemainder.toFixed(0);
    return (minutes < 10 ? '0' + minutes : minutes) + ':' + secondsRemainder.substr(-2) + '.' + milliseconds;
  };
})

.directive('autoChrono', ['$interval', '$filter', function ($interval, $filter) {
  return {
    templateUrl: '/ui/modules/apps/autoChrono/app.html',
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {

      // --- Constantes de detection du mouvement ---
      var SPEED_THRESHOLD = 0.5;   // m/s : au dessus, le vehicule est considere "en mouvement"

      // --- Etat du chrono ---
      scope.time = 0;
      scope.displayTime = $filter('secondsToDateTime')(scope.time);
      scope.isRunning = false;
      scope.isResetting = false;

      // --- Etat du mode auto ---
      // le mode auto ne fait QUE demarrer automatiquement le chrono quand le
      // vehicule bouge. Stop et Reset restent toujours pilotables manuellement,
      // meme quand le mode auto est actif (pas besoin de le desactiver).
      scope.autoMode = true;            // actif par defaut : c'est la raison d'etre du mod
      scope.lastFrameTime = null;       // timestamp (ms) du dernier passage dans streamsUpdate

      // --- Distance cumulee ---
      scope.distance = 0;                       // metres
      scope.displayDistance = (0).toFixed(2);   // km affiches, 2 decimales

      // --- Suivi des raccourcis clavier (detection de front montant) ---
      // les valeurs electrics restent a 1 tant que la touche est maintenue :
      // on ne veut declencher le toggle qu'une seule fois par appui
      scope.lastToggleAutoValue = 0;

      // --- Etat de la ligne de chronometrage (mode "tour chronometre") ---
      scope.gatePlaced = false;   // une ligne est-elle actuellement placee (cote GE) ?
      scope.gateEnabled = true;   // la ligne pilote-t-elle le chrono (checkbox) ?

      // demarre le chrono
      scope.startTimer = function() {
        if (scope.isRunning) {
          return;
        }
        scope.timerPromise = $interval(function() {
          scope.time += 0.01;
          scope.displayTime = $filter('secondsToDateTime')(scope.time);
        }, 10);
        scope.isRunning = true;
      };

      // met le chrono en pause (ne reset pas)
      scope.stopTimer = function() {
        if (!scope.isRunning) {
          return;
        }
        $interval.cancel(scope.timerPromise);
        scope.isRunning = false;
      };

      // reinitialise chrono + distance
      scope.resetTimer = function() {
        if (scope.isResetting) {
          return;
        }
        scope.isResetting = true;

        if (scope.isRunning) {
          $interval.cancel(scope.timerPromise);
          scope.isRunning = false;
        }
        scope.time = 0;
        scope.displayTime = $filter('secondsToDateTime')(scope.time);

        scope.distance = 0;
        scope.displayDistance = (0).toFixed(2);

        scope.isResetting = false;
      };

      // reinitialise le suivi temporel quand on bascule le mode auto
      scope.onAutoModeChange = function() {
        scope.lastFrameTime = null;
      };

      // appelee a chaque mise a jour du stream electrics : integre la distance
      // et demarre automatiquement le chrono si le mode auto est actif.
      // Le mode auto ne gere QUE le demarrage : l'arret et le reset restent
      // toujours accessibles manuellement (boutons ou raccourcis), sans avoir
      // a desactiver le mode auto au prealable.
      scope.updateFromWheelspeed = function(wheelspeed) {
        var now = performance.now();
        var dt = 0;

        if (scope.lastFrameTime !== null) {
          dt = (now - scope.lastFrameTime) / 1000;
          if (dt < 0 || dt > 0.5) {
            dt = 0; // delta aberrant (pause jeu, changement vehicule...) : on ignore
          }
        }
        scope.lastFrameTime = now;

        var absSpeed = Math.abs(wheelspeed);

        // integration de la distance, uniquement pendant que le chrono tourne
        if (scope.isRunning && dt > 0) {
          scope.distance += absSpeed * dt;
          scope.displayDistance = (scope.distance / 1000).toFixed(2);
        }

        // demarrage automatique : seul comportement pilote par le mode auto
        if (scope.autoMode && absSpeed > SPEED_THRESHOLD && !scope.isRunning) {
          scope.startTimer();
        }
      };

      // traite les impulsions envoyees par les raccourcis clavier
      // (electrics.values custom exposees par lua/vehicle/extensions/autoChrono.lua)
      scope.updateFromKeybinds = function(electrics) {
        // start / stop / reset : ces fonctions sont deja idempotentes
        // (elles gerent elles-memes le cas ou l'action est deja en cours),
        // donc pas besoin de detection de front ici
        if (electrics.autochrono_start === 1) {
          scope.startTimer();
        }
        if (electrics.autochrono_stop === 1) {
          scope.stopTimer();
        }
        if (electrics.autochrono_reset === 1) {
          scope.resetTimer();
        }

        // toggle du mode auto : necessite une detection de front montant
        // pour ne pas basculer en boucle tant que la touche est maintenue
        var toggleValue = electrics.autochrono_toggleAuto;
        if (toggleValue === 1 && scope.lastToggleAutoValue !== 1) {
          scope.autoMode = !scope.autoMode;
          scope.onAutoModeChange();
        }
        scope.lastToggleAutoValue = toggleValue;
      };

      // demande au GE de placer la ligne devant le vehicule actuel
      scope.placeGate = function() {
        if (typeof bngApi !== 'undefined') {
          bngApi.engineLua('extensions.autoChronoGate.placeGate()');
        }
      };

      // demande au GE de supprimer la ligne actuelle
      scope.removeGate = function() {
        if (typeof bngApi !== 'undefined') {
          bngApi.engineLua('extensions.autoChronoGate.removeGate()');
        }
      };

      scope.$on('$destroy', function() {
        if (scope.isRunning) {
          $interval.cancel(scope.timerPromise);
        }
      });
    },
    controller: ['$log', '$scope', function ($log, $scope) {
      $scope.$on('streamsUpdate', function (event, data) {
        $scope.$evalAsync(function () {
          if (data.electrics) {
            if (typeof data.electrics.wheelspeed === 'number') {
              $scope.updateFromWheelspeed(data.electrics.wheelspeed);
            }
            $scope.updateFromKeybinds(data.electrics);
          } else {
            $scope.data = undefined;
          }
        });
      });

      // notification du GE : la ligne a ete placee ou supprimee
      $scope.$on('AutoChronoGatePlaced', function (event, data) {
        $scope.$evalAsync(function () {
          $scope.gatePlaced = !!(data && data.placed);
        });
      });

      // notification du GE : le vehicule a franchi la ligne
      // on alterne start/stop a chaque franchissement (mode tour chronometre)
      $scope.$on('AutoChronoGateCrossed', function () {
        $scope.$evalAsync(function () {
          if (!$scope.gateEnabled) {
            return;
          }
          if ($scope.isRunning) {
            $scope.stopTimer();
          } else {
            $scope.startTimer();
          }
        });
      });
    }]
  };
}]);
