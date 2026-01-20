# ✅ Checklist de Mise à Jour (Portail Staff)

Ce fichier récapitule les actions manuelles à effectuer pour activer les nouveaux portails Administrateur et Professeur.

## 1. Base de Données (Supabase)
- [ ] Aller sur [Supabase.com](https://supabase.com).
- [ ] Ouvrir l'éditeur SQL (**SQL Editor**).
- [ ] Créer une nouvelle requête (**New Query**).
- [ ] Copier-coller le contenu de [setup_tables.sql](file:///c:/Users/mbeum/brique-1/setup_tables.sql).
- [ ] Cliquer sur **Run**.

## 2. Script Excel (VBA)
- [ ] Ouvrir votre fichier Excel `Suivi-Eleves-Term-V2.xlsx`.
- [ ] Appuyer sur `ALT + F11` (Éditeur VBA).
- [ ] Supprimer l'ancien module `SupabaseExport` (Clic droit > Supprimer).
- [ ] Menu **Fichier** > **Importer un fichier...**
- [ ] Sélectionner le nouveau [SupabaseExport.bas](file:///c:/Users/mbeum/brique-1/SupabaseExport.bas).

## 3. Données Excel
- [ ] Sur chaque onglet élèves (`T1`, `T2`, `T3`) :
    - [ ] Vérifier la **Colonne N (14)** : Ajouter les classes (ex: TG1, TG2).
    - [ ] Vérifier la **Colonne O (15)** : Ajouter les niveaux (ex: Terminale, Première).
- [ ] Cliquer sur le bouton **Synchroniser** pour envoyer les nouvelles données.

## 4. Test des Accès
- [ ] Retourner sur l'application Web.
- [ ] Se déconnecter si nécessaire.
- [ ] Tester la connexion **Staff** :
    - **Admin** : Nom: `ADMIN`, Code: `ADMIN2026`.
    - **Professeur** : Nom: `PROF_TEST`, Code: `PROF1234`.

---
*Note : Si vous changez le code d'un administrateur ou d'un professeur, faites-le directement dans la table `staff` sur Supabase.*
