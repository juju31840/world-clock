---
name: git-safety
description: Vérifications de sécurité avant tout commit ou push git sur ce projet — contrôle l'email de l'auteur et scanne les fichiers stagés à la recherche de secrets/clés API. À utiliser chaque fois qu'une commande git commit ou git push est sur le point d'être exécutée, ou quand l'utilisateur demande de committer/pousser des changements.
disable-model-invocation: false
---

# Git Safety Check

Avant d'exécuter `git commit` ou `git push` sur ce projet, effectue systématiquement les deux vérifications suivantes. Ne saute cette étape sous aucun prétexte, même si l'utilisateur semble pressé.

## 1. Vérifier l'identité git

L'email personnel autorisé pour ce projet est `jules.schuft@gmail.com`. L'email professionnel (domaine contenant `fr.gt.com` ou toute variante `@*.gt.com` / domaine d'entreprise) ne doit **jamais** être utilisé comme auteur des commits de ce repo.

Commandes à lancer :
```
git config user.email
git config user.name
```
(`git config` sans `--local`/`--global` résout l'effectif : local si présent, sinon global.)

- Si l'email résolu n'est pas `jules.schuft@gmail.com` → **STOP**. N'exécute pas le commit/push. Alerte l'utilisateur clairement : quel email est actuellement configuré, et propose de corriger avec `git config --local user.email "jules.schuft@gmail.com"` (ou global si l'utilisateur le demande) avant de continuer.
- Si l'email est correct → continue vers l'étape 2.

## 2. Scanner les fichiers stagés pour des secrets

Avant tout commit, inspecte le diff de ce qui va réellement être committé :
```
git diff --cached
```
(ou `git status` puis lire chaque fichier nouvellement ajouté si rien n'est encore stagé et que tu t'apprêtes à faire `git add`).

Recherche activement les patterns suivants dans le contenu stagé :
- Clés API / tokens : chaînes ressemblant à `AKIA...`, `sk-...`, `ghp_...`, `xox[baprs]-...`, tout token de 20+ caractères alphanumériques précédé de `api_key`, `apikey`, `secret`, `token`, `password`, `access_key`
- Fichiers sensibles par nom : `.env`, `.env.*` (hors `.env.example`), `credentials.json`, `*.pem`, `*.key`, `id_rsa*`
- Chaînes de connexion avec identifiants en clair (`mongodb://user:pass@...`, `postgres://user:pass@...`)

- Si un secret potentiel est détecté → **STOP**. N'exécute pas le commit/push. Montre à l'utilisateur exactement quelle ligne/fichier a déclenché l'alerte, et demande confirmation explicite avant de continuer (le fichier doit peut-être être ajouté à `.gitignore` plutôt que committé).
- Si rien de suspect n'est trouvé → tu peux procéder normalement au commit/push demandé.

## Résumé

Ne jamais committer ou pousser sans avoir fait ces deux checks dans l'ordre : identité → secrets. En cas de doute sur un faux positif, préfère alerter l'utilisateur plutôt que de committer silencieusement.
