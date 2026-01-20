# Guide d'Installation : Export Excel vers Supabase

Ce guide vous explique comment ajouter le bouton de synchronisation dans votre fichier Excel.

## 1. Importer le code VBA
1.  Ouvrez votre fichier Excel `Suivi-Eleves-Term-V2.xlsx`.
2.  Appuyez sur `ALT + F11` pour ouvrir l'éditeur Visual Basic.
3.  Allez dans le menu **Fichier** > **Importer un fichier...**
4.  Sélectionnez le fichier `SupabaseExport.bas` présent à la racine du projet.
5.  Un nouveau module nommé `SupabaseExport` devrait apparaître dans la liste à gauche.

## 2. Créer le bouton dans Excel
Pour chaque onglet à synchroniser (votre onglet doit s'appeler `Affichage eleves T1`, `Planning`, etc.) :

1.  Allez sur l'onglet dans Excel.
2.  Allez dans le ruban **Développeur** (si vous ne l'avez pas, faites un clic droit sur le ruban > Personnaliser le ruban > Cochez "Développeur").
3.  Cliquez sur **Insérer** et choisissez le premier bouton dans **Contrôles de formulaire**.
4.  Dessinez le bouton sur votre feuille.
5.  Une fenêtre "Affecter une macro" s'ouvre : sélectionnez `SynchroniserOngletActif`.
6.  Renommez le bouton (ex: "Synchroniser avec le Web").

## 3. Préparer vos données
*   **Colonne A & B** : Nom et Prénom de l'élève.
*   **Colonnes C à L** : Vos différentes notes (Moyenne, QCM, etc.).
*   **Colonne M (13ème colonne)** : Ajoutez un **Code Secret** pour chaque élève (ex: un nombre à 4 chiffres). *C'est ce code qu'ils utiliseront pour se connecter.*

## 4. Utilisation
*   Assurez-vous d'avoir une connexion internet.
*   Cliquez sur le bouton pour envoyer les données de l'onglet actif vers la base de données.
*   Un message s'affichera une fois l'export terminé.

> [!IMPORTANT]
> Ne changez pas le nom des colonnes ni l'ordre. Le script VBA envoie désormais 13 colonnes (la 13ème étant le code secret).
