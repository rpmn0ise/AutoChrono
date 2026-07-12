-- AutoChrono - extension vehicule
-- Auteur : rpmn0ise
-- Role : exposer des valeurs electrics "impulsion" declenchees par les raccourcis
-- clavier (voir lua/ge/extensions/core/input/actions/autoChronoInputs.json).
-- L'UI (ui/modules/apps/autoChrono/app.js) lit ces valeurs via le stream standard
-- 'electrics', au meme titre que electrics.wheelspeed. Fichier propre a ce mod,
-- sans rapport avec un autre mod.

local M = {}

-- valeurs initiales (0 = pas d'evenement en cours)
electrics.values['autochrono_start']       = 0
electrics.values['autochrono_stop']        = 0
electrics.values['autochrono_reset']       = 0
electrics.values['autochrono_toggleAuto']  = 0

-- demarre le chronometre (touche maintenue = VALUE 1, relachee = VALUE 0)
local function startTimer(VALUE)
    electrics.values['autochrono_start'] = VALUE
end

-- met le chronometre en pause
local function stopTimer(VALUE)
    electrics.values['autochrono_stop'] = VALUE
end

-- reinitialise chronometre + distance
local function resetTimer(VALUE)
    electrics.values['autochrono_reset'] = VALUE
end

-- active/desactive le mode auto (front montant gere cote UI)
local function toggleAuto(VALUE)
    electrics.values['autochrono_toggleAuto'] = VALUE
end

M.startTimer  = startTimer
M.stopTimer   = stopTimer
M.resetTimer  = resetTimer
M.toggleAuto  = toggleAuto

return M
