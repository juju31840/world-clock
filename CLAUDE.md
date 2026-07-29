# CLAUDE.md — World Clock

Ce fichier est chargé automatiquement par Claude Code à l'ouverture de ce projet. Aucun `CLAUDE.md`
n'existait avant (seul un `README.md` minimal, "world-clock / Fuseaux horaires").

## Contexte produit

Appli web de fuseaux horaires : liste de villes/fuseaux, recherche, comparateur multi-fuseaux,
favoris, drapeaux par pays. Aucun `brief.md` dans ce dépôt — l'intention produit se déduit du code
et des commits (pas de spec écrite séparée comme pour les deux autres projets de l'utilisateur).

## État réel du site (au 29/07/2026)

**100% vanilla JS en modules ES natifs** (`<script type="module">`), pas de framework, pas de build,
pas de `package.json`. **Important, différent de Garage Martin** : les modules ES imposent une vraie
origine HTTP — ouvrir `index.html` directement en `file://` ne fonctionnera pas (CORS bloque les
imports de modules). C'est pour ça que `serve.ps1` existe à la racine : un serveur HTTP minimal en
PowerShell pur (`System.Net.HttpListener`), sans dépendance, pensé spécifiquement pour cette machine
sans Node.js.

**Pour tester ce projet sur cette machine :**
```
powershell -File serve.ps1
```
puis ouvrir `http://localhost:8080/`. Aucune installation requise — contrairement à Vibetrip, ce
projet est testable dès maintenant.

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

## Outillage spécifique à ce projet (compense l'absence de Node/linter)

- **Hooks** (`.claude/settings.json`, scripts PowerShell dans `.claude/hooks/`) :
  - `PreToolUse` sur `Bash` : bloque tout `git commit` si un `console.log()` non commenté est présent
    dans les fichiers `.js` stagés (`block-console-log.ps1`).
  - `PostToolUse` sur `Write|Edit` : vérification basique d'équilibre accolades/parenthèses après
    modification d'un `.js`/`.css` (`check-basic-syntax.ps1`) — ne remplace pas un vrai linter,
    le message le rappelle explicitement ("Node n'est pas installé sur cette machine").
- `.claude/skills/` : `git-safety` (email auteur + scan secrets avant commit/push), `visual-check`
  (rappel de vérification visuelle après modif CSS/HTML).
- `.mcp.json` : `context7`, `exa`.

## Points d'attention

- Pas de suite de tests automatisés détectée — la vérification reste manuelle (`visual-check` +
  ouverture réelle via `serve.ps1`).
- Le hook `check-basic-syntax.ps1` est volontairement rudimentaire (comptage de caractères, pas un
  vrai parseur) — ne pas s'y fier comme garantie de code valide, seulement comme filet minimal.

## Prochaines actions probables

1. Lancer `serve.ps1` et vérifier visuellement les fonctionnalités listées ci-dessus — ce projet est
   immédiatement testable, contrairement à Vibetrip.
2. Pas de roadmap/TODO écrite connue pour ce projet — redemander à l'utilisateur ce qu'il veut faire
   ensuite plutôt que de supposer une prochaine étape.
