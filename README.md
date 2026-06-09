# Studio de decoupe et d'animation

Application web statique pour :

- charger une image d'infographie,
- detecter automatiquement des zones visuelles,
- mieux conserver aussi les zones rondes ou quasi circulaires,
- exporter chaque zone en `PNG` transparent,
- composer une slide HTML d'animation a superposer a un diaporama existant.

## Ouvrir l'application

Ouvrir simplement `index.html` dans un navigateur moderne.

Raccourci utile :

- dans le panneau de detection, la touche `Entree` lance l'analyse avec les valeurs en cours.

## Workflow actuel

1. Charger une image.
2. Choisir un preset de detection puis lancer l'analyse.
3. Selectionner les zones a garder dans la slide d'animation.
4. Regler l'ordre d'apparition et l'effet de chaque zone.
5. Choisir le format et le mode de declenchement du diaporama.
6. Exporter une slide HTML transparente.

## Detection

- `Preset de detection` : applique un profil adapte au type d'infographie.
- `Sensibilite couleur` : ecart minimal par rapport a la couleur de fond estimee.
- `Taille minimale d'une zone` : filtre les petits fragments.
- `Marge autour des zones` : ajoute de l'air autour du bloc exporte.
- `Fusion de zones proches` : regroupe des morceaux voisins en un seul export.
- les zones rondes detectees sont exportees avec une transparence adaptee pour mieux respecter leur forme.

### Presets disponibles

- `Equilibre` : point de depart polyvalent.
- `Infographie a cadres` : pour tableaux, cellules, encadres et blocs texte.
- `Elements fins` : pour recuperer des details plus petits.
- `Gros blocs` : pour privilegier des zones larges et consolidees.
- `Infographie dense` : pour mieux separer des contenus proches.
- `Zones bien separees` : pour des visuels deja espaces.
- `Personnalise` : apparait des que les curseurs sont modifies a la main.

## Editeur d'animation

L'editeur permet maintenant de :

- inclure ou retirer une zone de la slide exportee,
- choisir son `etape de revelation`,
- regler un effet d'entree zone par zone ou par etape,
- redecouper une zone detectee localement par `double analyse`,
- grouper plusieurs zones pour une apparition coordonnee,
- sauvegarder tout le projet en `JSON` puis le recharger plus tard,
- ajuster duree, delai, decalage, echelle et rotation,
- previsualiser le rendu directement dans l'application, y compris en plein ecran.

### Selection multiple

La selection des zones fonctionne maintenant comme dans un explorateur de fichiers :

- clic simple : selection d'une seule zone,
- `Ctrl` ou `Cmd` + clic : ajout ou retrait de la zone a la selection courante.

### Double analyse locale

Dans l'inspecteur de zone, tu peux maintenant :

- `Redecouper auto`
- `Redecouper verticalement`
- `Redecouper horizontalement`
- `Forcer 2 colonnes`
- `Forcer 3 colonnes`
- `Forcer 4 colonnes`
- `Reinitialiser le second decoupage`

Le principe est simple : on refait une analyse uniquement dans l'emprise de la zone selectionnee, sans relancer toute l'image. C'est pratique quand une zone detectee est correcte globalement mais trop large, par exemple pour separer plusieurs colonnes ou plusieurs blocs empiles.

### Effets actuellement disponibles

- `Fondu net`
- `Fondu depuis le bas`
- `Fondu depuis le haut`
- `Fondu depuis la gauche`
- `Fondu depuis la droite`
- `Zoom doux`
- `Pop subtil`
- `Brume laterale gauche`
- `Brume laterale droite`
- `Brume montante`
- `Glissement feutre gauche`
- `Glissement feutre droite`

### Reglage par etape

Le panneau `Reglage par etape` permet de :

- choisir une etape ciblee,
- imposer un effet commun a toutes les zones de cette etape,
- regler une duree commune,
- ajouter un decalage progressif entre les zones de la meme etape.

### Liste des zones

Sous l'apercu, une liste des zones permet maintenant de :

- voir l'ordre global de passage,
- reordonner les zones avec poignees visuelles et boutons de deplacement,
- faire correspondre plus facilement le rendu anime a la narration.

### Groupes d'apparition

Sous l'apercu, le panneau `Groupes d'apparition` permet de :

- selectionner 2, 3 ou plus zones,
- cliquer sur `Grouper la selection`,
- creer un evenement editable a partir de cette selection,
- fixer une etape commune au groupe,
- definir un `stagger` en millisecondes entre les membres,
- reordonner les zones du groupe avec la liste a poignees.

Le groupe apparait alors de maniere synchronisee, avec un decalage progressif propre entre ses membres.

Chaque zone d'un meme evenement peut conserver son propre effet d'apparition. Le groupe sert surtout a partager une etape commune et un decalage temporel, pas a imposer obligatoirement le meme effet visuel a tous les membres.

### Presets de presentation

Des presets plus scenarises sont disponibles pour appliquer rapidement une ambiance globale :

- `Cascade`
- `Organique`
- `Floral`
- `Constellation`

Ils redistribuent les effets, les etapes et les decalages pour produire des arrivees plus expressives tout en restant lisibles.

### Reglages de slide

- `Format de sortie` :
  `16:9`, `16:10`, `4:3`, `3:2`, `1:1`, `21:9`, `9:16`, `A4 paysage`, `A4 portrait`.
- `Demarrage de l'animation` :
  - au changement de slide,
  - au premier clic,
  - a la premiere touche.
- `Progression des etapes` :
  - tout d'un coup,
  - automatique par etape,
  - une etape par clic,
  - une etape par touche.

Par defaut, le demarrage de l'animation et la progression sont maintenant regles sur `touche`.

## Sauvegarde de projet

Deux boutons permettent maintenant de memoriser un travail complet :

- `Sauvegarder le projet JSON` : enregistre l'image source, les zones detectees, les groupes, les redecoupages locaux et les reglages d'animation.
- `Ouvrir un projet JSON` : recharge ce meme etat pour reprendre l'edition sans repartir de zero.

## Export HTML

L'export produit une page HTML autonome avec :

- fond transparent,
- positionnement des zones sur une scene au format choisi,
- gestion du declenchement et des etapes,
- animations CSS/JS embarquees.

Les PNG de zones sont generes a partir de la resolution native de l'image source, sans reduction intermediaire.

Cette slide peut servir de surcouche visuelle dans un diaporama HTML existant.

## Limites actuelles

- La detection reste heuristique et depend beaucoup du fond et de la structure visuelle.
- Le preset `Infographie a cadres` aide nettement sur les grilles et tableaux, mais ne remplace pas encore un vrai editeur manuel de boites.
- La sauvegarde JSON sert a reprendre le travail dans cette application, pas encore a piloter directement l'editeur de presentation cible.
- Le telechargement groupe des PNG se fait fichier par fichier, sans archive ZIP.

## Suites logiques

- ajouter un vrai mode de correction manuelle des zones,
- permettre de dupliquer des zones ou d'ajouter des titres purement HTML,
- exporter aussi un manifeste JSON d'animation,
- proposer un mode d'integration plus direct avec la trame de presentation cible.
