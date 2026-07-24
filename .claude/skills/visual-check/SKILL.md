---
name: visual-check
description: Rappel de vérification visuelle après toute modification de fichiers CSS ou HTML dans ce projet (index.html, css/*.css). À utiliser après avoir édité ou créé un fichier .css ou .html, avant de déclarer la tâche terminée à l'utilisateur.
disable-model-invocation: false
---

# Vérification visuelle après modification CSS/HTML

Ce projet (World Clock) n'a pas de suite de tests visuels automatisés — la seule façon de savoir si un changement CSS/HTML fonctionne réellement est de le voir rendu dans un navigateur. Après avoir modifié un ou plusieurs fichiers `.css` ou `.html` (`index.html`, `css/base.css`, `css/layout.css`, `css/components.css`), avant de dire à l'utilisateur que c'est fait :

## 1. S'assurer que le serveur local tourne

Le serveur statique (`serve.ps1`, port 8080) doit être actif. Vérifie et relance-le si besoin :
```
Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet
```
Si `False` ou aucune réponse, relance-le en arrière-plan :
```
Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','.\serve.ps1' -WindowStyle Hidden
```
Le navigateur charge les fichiers statiques directement (pas de build), donc un simple rafraîchissement de la page (`F5` / `Ctrl+R`) côté utilisateur suffit après un changement CSS/HTML — aucun redémarrage du serveur n'est nécessaire sauf si `serve.ps1` lui-même a été modifié (voir note MIME type dans les échanges précédents) ou si le serveur ne répond plus.

## 2. Ne jamais affirmer un résultat visuel sans l'avoir vérifié

Si aucun outil de navigateur (ex. `claude-in-chrome`) n'est disponible dans la session, il est **interdit** de dire des phrases comme "c'est corrigé", "les cartes sont maintenant bien alignées", "le texte ne déborde plus" sans qualification — c'est une affirmation invérifiée.

À la place :
- Décris concrètement et techniquement ce qui a changé dans le CSS/HTML (ex. "j'ai ajouté `min-width: 0` sur `.compare-card__title` pour permettre au texte de wrapper au lieu de déborder, et augmenté `minmax(300px, 1fr)` sur la grille pour élargir les cartes").
- Indique explicitement que ce changement n'a pas été vérifié visuellement dans un navigateur.
- Demande à l'utilisateur de rafraîchir `http://localhost:8080` et de confirmer si le rendu correspond à l'attente, en précisant quoi regarder spécifiquement (quel élément, quel écran/résolution si pertinent).

Si un outil de navigateur est disponible dans la session, utilise-le pour charger la page et vérifier réellement le rendu avant de répondre — dans ce cas, décris ce qui a été observé, pas seulement ce qui a été codé.

## Résumé

Après un changement CSS/HTML : serveur actif → description technique précise du changement → aveu explicite de non-vérification (sauf vérification réelle possible) → demande de confirmation utilisateur. Ne jamais présenter un changement visuel comme confirmé sans preuve.
