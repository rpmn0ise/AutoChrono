-- AutoChrono - extension moteur (GE)
-- Auteur : rpmn0ise
-- Role : placer une "ligne" de chronometrage devant le vehicule joueur, et
-- notifier l'UI a chaque franchissement (mode "tour chronometre" : on alterne
-- start/stop a chaque passage).
--
-- Choix technique : detection MANUELLE par calcul de position a chaque frame
-- (plutot que par un vrai objet BeamNGTrigger spawn dynamiquement), car ca ne
-- repose que sur des API bien etablies (getPosition, getDirectionVector,
-- onUpdate, debugDrawer) et c'est donc plus fiable sans test en jeu prealable.
-- La ligne est redessinee chaque frame via debugDrawer (pas d'objet persistant
-- dans la scene).
--
-- IMPORTANT : la detection est limitee au rectangle blanc dessine (largeur +
-- hauteur). Sans cette limite, le plan de detection serait infini et couperait
-- toute la carte de part et d'autre de la ligne visible.

local M = {}

local GATE_HALF_WIDTH = 4      -- demi-largeur de la ligne dessinee ET de la zone de detection (m)
local GATE_HEIGHT = 2.5        -- hauteur du trait dessine ET de la zone de detection (m)
local COOLDOWN_SEC = 3         -- delai mini entre deux franchissements valides (anti rebond)
local FORWARD_OFFSET = 8       -- distance devant le vehicule ou la ligne est placee (m)
local HEIGHT_MARGIN = 1        -- marge (m) sous la base et au dessus du sommet, pour tolerer les vehicules hauts/bas

local gate = nil               -- {pos=vec3, normal=vec3, right=vec3} ou nil si pas de ligne
local lastSide = nil           -- cote (+1/-1) ou se trouvait le vehicule a la frame precedente
local lastCrossTime = -math.huge

-- place (ou replace) la ligne devant le vehicule joueur actuel
local function placeGate()
  local veh = be:getPlayerVehicle(0)
  if not veh then
    log('E', 'autoChronoGate', 'Aucun vehicule joueur trouve, impossible de placer la ligne')
    return
  end

  local pos = veh:getPosition()
  local dir = veh:getDirectionVector()
  dir.z = 0
  dir = dir:normalized()

  local gatePos = pos + dir * FORWARD_OFFSET
  local right = dir:cross(vec3(0, 0, 1)):normalized()

  gate = { pos = gatePos, normal = dir, right = right }
  lastSide = nil
  lastCrossTime = -math.huge

  guihooks.trigger('AutoChronoGatePlaced', { placed = true })
end

-- supprime la ligne actuelle
local function removeGate()
  gate = nil
  lastSide = nil
  guihooks.trigger('AutoChronoGatePlaced', { placed = false })
end

-- appelee automatiquement par le moteur a chaque frame
local function onUpdate(dtReal, dtSim, dtRaw)
  if not gate then
    return
  end

  local veh = be:getPlayerVehicle(0)
  if not veh then
    return
  end

  -- --- reperage visuel : on redessine le rectangle chaque frame ---
  local p1 = gate.pos + gate.right * GATE_HALF_WIDTH
  local p2 = gate.pos - gate.right * GATE_HALF_WIDTH
  local p1top = p1 + vec3(0, 0, GATE_HEIGHT)
  local p2top = p2 + vec3(0, 0, GATE_HEIGHT)

  debugDrawer:drawLine(p1, p2, ColorF(1, 1, 1, 1))
  debugDrawer:drawLine(p1, p1top, ColorF(1, 1, 1, 0.5))
  debugDrawer:drawLine(p2, p2top, ColorF(1, 1, 1, 0.5))
  debugDrawer:drawLine(p1top, p2top, ColorF(1, 1, 1, 0.5))

  -- --- position du vehicule dans le repere local de la ligne ---
  local vehPos = veh:getPosition()
  local toVeh = vehPos - gate.pos

  local forwardDist = toVeh:dot(gate.normal)   -- distance signee : de quel cote de la ligne
  local lateralDist = toVeh:dot(gate.right)    -- position le long de la largeur du rectangle
  local heightDist = vehPos.z - gate.pos.z     -- hauteur par rapport a la base du rectangle

  -- le vehicule doit se trouver dans les limites du rectangle blanc pour
  -- que le franchissement compte (sinon plan infini = coupe toute la carte)
  local insideWidth = math.abs(lateralDist) <= GATE_HALF_WIDTH
  local insideHeight = (heightDist >= -HEIGHT_MARGIN) and (heightDist <= GATE_HEIGHT + HEIGHT_MARGIN)

  local side = forwardDist >= 0 and 1 or -1

  if insideWidth and insideHeight and lastSide ~= nil and side ~= lastSide then
    local now = os.clock()
    if (now - lastCrossTime) >= COOLDOWN_SEC then
      lastCrossTime = now
      -- notifie l'UI : c'est app.js qui decide start ou stop selon son etat
      guihooks.trigger('AutoChronoGateCrossed', { time = now })
    end
  end

  -- on ne met a jour "lastSide" que quand le vehicule est dans le rectangle,
  -- pour eviter un faux "changement de cote" detecte hors zone puis compte
  -- au retour dans la zone
  if insideWidth and insideHeight then
    lastSide = side
  end
end

M.placeGate = placeGate
M.removeGate = removeGate
M.onUpdate = onUpdate

return M
