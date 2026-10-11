# CLAUDE.md — World Clock

Ce fichier est chargé automatiquement par Claude Code à l'ouverture de ce projet. Aucun `CLAUDE.md`
n'existait avant (seul un `README.md` minimal, "world-clock / Fuseaux horaires").

## Contexte produit

Appli web de fuseaux horaires : liste de villes/fuseaux, recherche, comparateur multi-fuseaux,
favoris, drapeaux par pays. Aucun `brief.md` dans ce dépôt — l'intention produit se déduit du code
et des commits (pas de spec écrite séparée comme pour les deux autres projets de l'utilisateur).

## État actuel (vérifié dans le code le 29/07/2026, outillage mis à jour le 11/10/2026)

**100% vanilla JS en modules ES natifs** (`<script type="module">`), pas de framework, pas de build,
pas de `package.json`. **Important, différent de Garage Martin** : les modules ES imposent une vraie
origine HTTP — ouvrir `index.html` directement en `file://` ne fonctionnera pas (CORS bloque les
imports de modules). C'est pour ça que `serve.ps1` existe à la racine : un serveur HTTP minimal en
PowerShell pur (`System.Net.HttpListener`), pensé pour la machine Windows d'origine.

**Pour tester ce projet :**
- sur Mac : `python3 -m http.server 8080` à la racine ;
- sous Windows : `powershell -File serve.ps1` ;

puis ouvrir `http://localhost:8080/`. Aucune installation requise.

6 commits, tout poussé sur `main` (`github.com/juju31840/world-clock`), rien en attente.

**Fonctionnalités déjà implémentées** (V1, `js/main.js` orchestre tout) :
- Liste des fuseaux horaires (`timezones.js`, `list.js`) avec horloge en direct (`clock.js`).
- Recherche (`search.js`).
- Comparateur multi-fuseaux (`compare.js`).
- Favoris persistés (`favorites.js` + `storage.js`, `localStorage`).
- Drapeaux par pays (`flag.js`, 155 fichiers dans `assets/flags/`), avec repli en initiales
  pays/fuseau (pas d'emoji globe) quand aucun drapeau n'existe ou que l'image échoue à charger —
  corrigé dans le dernier commit (`5c3531c`), à revérifier visuellement si des bugs de layout
  apparaissent sur ce point précis.
- Format d'heure basculable 12h/24h (`settings.js`).

## Outillage spécifique à ce projet

- **Hooks** (`.claude/settings.json`, scripts Python dans `.claude/hooks/` depuis le 11/10/2026 ; les
  versions PowerShell `.ps1` restent pour Windows) :
  - `PreToolUse` sur `Bash` : bloque tout `git commit` si un `console.log()` non commenté est présent
    dans les fichiers `.js` stagés (`block_console_log.py`).
  - `PostToolUse` sur `Write|Edit` : vérification basique d'équilibre accolades/parenthèses après
    modification d'un `.js`/`.css` (`check_basic_syntax.py`) — ne remplace pas un vrai linter.
- `.claude/skills/` : `git-safety` (email auteur + scan secrets avant commit/push), `visual-check`
  (rappel de vérification visuelle après modif CSS/HTML).
- `.mcp.json` : `context7`, `exa`.

## Points d'attention

- Pas de suite de tests automatisés détectée — la vérification reste manuelle (`visual-check` +
  ouverture réelle via un serveur local : `serve.ps1` sous Windows, `python3 -m http.server` sur Mac).
- Le hook `check_basic_syntax.py` est volontairement rudimentaire (comptage de caractères, pas un
  vrai parseur) — ne pas s'y fier comme garantie de code valide, seulement comme filet minimal.

## Prochaine action

Aucune prévue (pas de roadmap écrite) : demander à Jules ce qu'il veut faire plutôt que de supposer. Pour tester : `python3 -m http.server 8080` à la racine, puis ouvrir http://localhost:8080.
