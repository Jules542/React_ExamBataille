export type Carte = {
    valeur: number;
    couleur: string;
};

export type Joueur = {
    name: string;
    score: number;
    liste_cartes: Carte[];
};