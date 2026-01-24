# Sécurisation des clés Supabase dans les scripts Excel et Google Sheet

## 1. Nature de la clé utilisée
- La clé présente dans les scripts est une **SERVICE_ROLE_KEY**.
- Cette clé donne un accès complet à la base de données Supabase (lecture, écriture, modification, suppression).
- Elle doit rester **strictement secrète** et ne jamais être exposée côté client (Excel, Google Sheet, navigateur, etc.).

## 2. Risques de sécurité
- Si la SERVICE_ROLE_KEY est exposée, n’importe qui peut accéder à toutes les données de la base, sans restriction.
- Risques : fuite de données, suppressions ou modifications malveillantes.

## 3. Bonnes pratiques de configuration Supabase
- Utiliser la clé **ANON** (clé publique) côté client, qui respecte les règles de sécurité (RLS) définies dans Supabase.
- La **SERVICE_ROLE_KEY** doit être utilisée uniquement côté serveur (backend, fonctions cloud, API sécurisée).

## 4. Configuration recommandée dans Supabase
- **a.** Activer le Row Level Security (RLS) sur toutes les tables.
- **b.** Créer des policies (politiques) pour autoriser uniquement les opérations nécessaires selon le rôle (lecture, écriture, etc.).
- **c.** N’utiliser la SERVICE_ROLE_KEY que dans des environnements sécurisés (backend, serveurs, scripts privés).
- **d.** Pour les scripts Excel/Google Sheet :
    - Si l’écriture depuis ces outils est indispensable, créer une fonction RPC (Remote Procedure Call) dans Supabase avec des contrôles stricts (vérification de code prof, logs, etc.).
    - Utiliser une clé API dédiée avec des permissions limitées (si possible).
    - Ne jamais stocker la SERVICE_ROLE_KEY dans un fichier partagé ou accessible publiquement.

## 5. Actions à mener
- Changer immédiatement la SERVICE_ROLE_KEY si elle a été exposée.
- Revoir les scripts pour utiliser la clé ANON si possible.
- Documenter les accès et surveiller les logs Supabase pour détecter toute activité suspecte.

## 6. Documentation Supabase utile
- [Gestion des clés](https://supabase.com/docs/guides/api/keys)
- [Sécurité et RLS](https://supabase.com/docs/guides/auth/row-level-security)

---

**Besoin d’exemples de configuration de policies ou de sécurisation d’un endpoint ? Précisez votre demande !**
