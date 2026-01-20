# Plan d'implémentation : Excel vers Supabase

Ce plan détaille la configuration de la base de données et le script VBA pour synchroniser vos tableaux.

## 1. Schéma de la Base de Données (Supabase)

Nous allons créer deux tables. Copiez le code SQL ci-dessous dans l'éditeur SQL de Supabase.

### Table `planning` (Onglet: Affichage-ib-planning)
*Note : Colonnes normalisées (minuscules, sans accents).*
- `id` (int8, PK, auto-incrément)
- `eleve` (text) -- *Ajouté automatiquement pour identifier l'élève associé si présent, sinon à ignorer*
- `cond` (text)
- `rec` (text)
- `deriv` (text)
- `signe` (text)
- `sg` (text)
- `cv` (text)
- `python` (text)
- `lim` (text)
- `graph` (text)
- `conv` (text)
- `vect` (text)
- `dte` (text)
- `lim_fn` (text)
- `co` (text)
- `den` (text)
- `trigo` (text)
- `plan` (text)
- `v` (text)
- `bino` (text)
- `integr` (text)
- `aire` (text)
- `int_plus` (text) -- *Pour la colonne "Int+<"*
- `va` (text)
- `ed` (text)

### Table `eleves` (Onglets: Affichage eleves T1, T2, T3)
- `id` (int8, PK, auto-incrément)
- `trimestre` (text) - *Pour différencier T1, T2, T3*
- `nom` (text)
- `prenom` (text)
- `moyenne` (numeric)
- `qcm` (numeric)
- `regularite` (numeric)
- `brique_ib` (numeric)
- `brique_plus` (numeric)
- `total_briques` (numeric)
- `apprentissage` (numeric)
- `dst` (numeric)
- `bb` (numeric)
- `moy_dst` (numeric)

## 2. Script VBA

Le script VBA contiendra :
1.  **Configuration** : URL Supabase et Clé API.
2.  **Mapping** : Une fonction qui lit les colonnes Excel correspondantes aux champs de la DB.
    *   Le script lira à partir de la **3ème ligne** (puisque ligne 2 = titres).
3.  **Envoi** : Une requête POST pour chaque ligne.

### Boutons dans Excel
Nous créerons une macro `SynchroniserOngletActif` que vous pourrez lier à un bouton sur chaque page. La macro détectera automatiquement le nom de l'onglet actif pour savoir dans quelle table envoyer les données.

## 3. Étapes pour l'utilisateur
1.  Exécuter le script SQL dans Supabase (fourni à l'étape suivante).
2.  Ouvrir Excel, `ALT+F11`, insérer le code VBA (fourni à l'étape suivante).
3.  Ajouter les boutons et tester.

## 4. Portail Web (Frontend)

### Stack Technique
- **Framework** : React (Vite)
- **Styling** : Tailwind CSS (pour le design premium/moderne)
- **Icons** : Lucide React
- **Charts** : Recharts (pour les graphiques de notes)
- **Backend/Data** : Supabase Client (`@supabase/supabase-js`)

### Architecture des Pages
1.  **Page de Connexion (`/`)**
    *   Simple et élégante.
    *   Formulaire : Nom + Prénom (ou Code).
    *   *Note : Pour simplifier sans gérer d'emails, nous pourrons générer un "Code d'accès" unique pour chaque élève dans Excel plus tard.*

2.  **Tableau de Bord Élève (`/dashboard`)**
    *   **Header** : Bonjour [Prénom], Classe/Brique.
    *   **Section Planning** : Affichage du planning de la semaine (Table `planning`).
    *   **Section Résultats** :
        *   Cartes résumées (Moyenne Générale, Briques validées).
        *   Graphique radar ou barres pour les compétences (Regularité, QCM, DST...).
        *   Détail par trimestre (T1, T2, T3) via des onglets.

### Sécurité (Approche Simplifiée)
- Le frontend interrogera Supabase en filtrant par le nom de l'élève connecté.
- RLS (Row Level Security) : Idéalement, on restreint l'accès, mais dans un premier temps, nous filtrerons côté client pour la démo.

