import './Bataille.css'
import { useState, useEffect } from "react"
import {Carte, Joueur} from "../Types"


const Bataille = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const couleurs = ["Coeur", "Carreau", "Pique", "Trefle"]
    const valeurs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11 12 13 14 représentent Valets Dames Rois et As
    const [randomPaquet, setRandomPaquet] = useState<Carte[]>([])
    const [joueur, setJoueur] = useState<Joueur>()
    const [bot, setBot] = useState<Joueur>()

    const [choixJoueur, setChoixJoueur] = useState<number>()
    const [resultatManche, setResultatManche] = useState<String>("")

    const [derniereCarteJoueeJoueur, setDerniereCarteJoueeJoueur] = useState<Carte | null>(null);
    const [derniereCarteJoueeBot, setDerniereCarteJoueeBot] = useState<Carte | null>(null);

    //Si il y a une égalité
    const [indexBrulee, setIndexBrulee] = useState<number>()
    const [indexCarteEgalite, setIndexCarteEgalite] = useState<number>()
    //Pour disable les boutons des cartes déjà utilisées
    const [cartesSelectionnees, setCartesSelectionnees] = useState<number[]>([]);


    useEffect(() => {
        if (randomPaquet.length > 0) {
            createPlayers();
        }   
    }, [randomPaquet])

    const getNomCarte = (valeur: number): string => {
        switch (valeur) {
            case 11:
                return "Valet";
            case 12:
                return "Dame";
            case 13:
                return "Roi";
            case 14:
                return "As";
            default:
                return valeur.toString()
        }
    };

    //Fonction créant un paquet de cartes puis les melangeant aleatoirement
    const createRandomSuite = () => {
        const melangeCartes: Carte[] =[]
        for (const couleur of couleurs)
        {
            for (const valeur of valeurs)
            {
                const uneCarte = {valeur, couleur}
                melangeCartes.push(uneCarte)
            }
        }        

        setRandomPaquet(melangeCartes.sort(() => Math.random() - 0.5));
    }

    //Fonction pour créer les 2 joueurs et leur donner chacun la moitie du paquet aléatoire
    const createPlayers = () => {
        let mainJoueur:Carte[] = []
        for (let i = 0; i < 26; i++)
        {
            mainJoueur.push(randomPaquet[i])
        }

        let mainBot = [] 
        for (let i = 26; i < randomPaquet.length; i++)
        {
            mainBot.push(randomPaquet[i])
        }

        setJoueur({name:"Moi", score:0, liste_cartes: mainJoueur})
        setBot({name:"Bot", score:0, liste_cartes: mainBot})
    }

    const choixCarteJoueur = (index: number) => {
        setChoixJoueur(index)

        const carteJoueur = joueur.liste_cartes[index]
        const carteBot = bot.liste_cartes[0]

        setDerniereCarteJoueeJoueur(carteJoueur)
        setDerniereCarteJoueeBot(carteBot)

        let resultat: String;
        if (carteJoueur.valeur > carteBot.valeur) {
            resultat = "Gagné";
        } else if (carteJoueur.valeur < carteBot.valeur) {
            resultat = "Perdu";
        } else {
            resultat = "Egalité";
        }
    
        setResultatManche(resultat)
        majPaquetsJoueurs(resultat, index)
    }

    const choixCarteBrulee = (index: number) => {
        const carteBrulee = joueur?.liste_cartes[index]

        setCartesSelectionnees([...cartesSelectionnees, index]);
        setIndexBrulee(index)
    }

    const choixCarteEgalite = (index: number) => {
        const carteEgalite = joueur?.liste_cartes[index]

        setCartesSelectionnees([...cartesSelectionnees, index]);
        setIndexCarteEgalite(index)

        if (carteEgalite && bot && carteEgalite.valeur < bot?.liste_cartes[2].valeur)
        {
            setResultatManche("Perdu")

            const nouvelleListeCartesBot = [...bot.liste_cartes]
            const nouvelleListeCartesJoueur = [...joueur.liste_cartes]

            const indicesASupprimer = [choixJoueur, indexBrulee, index].filter(i => i !== undefined) as number[];

            const cartesPerduesJoueur = indicesASupprimer.map(i => nouvelleListeCartesJoueur[i]);
            indicesASupprimer.sort((a, b) => b - a);
            indicesASupprimer.forEach(i => nouvelleListeCartesJoueur.splice(i, 1));        
            
            nouvelleListeCartesBot.push(...cartesPerduesJoueur)            

            if (bot)
            {
            setBot(ancienBot => ({ ...bot, score: ancienBot.score + 1, liste_cartes: nouvelleListeCartesBot }));
            }
            if(joueur)
            {
            setJoueur({ ...joueur, liste_cartes: nouvelleListeCartesJoueur })
            }
        }
        else if (carteEgalite && bot && carteEgalite.valeur > bot?.liste_cartes[2].valeur)
        {
            setResultatManche("Gagné")

            const nouvelleListeCartesBot = [...bot.liste_cartes]
            const nouvelleListeCartesJoueur = [...joueur.liste_cartes]

            const cartesPerduesBot = nouvelleListeCartesBot.splice(0, 3)

            nouvelleListeCartesJoueur.push(...cartesPerduesBot)

            if (bot)
            {
            setBot({ ...bot, liste_cartes: nouvelleListeCartesBot })
            }
            if(joueur)
            {
            setJoueur(ancienJoueur => ({ ...joueur, score: ancienJoueur.score + 1, liste_cartes: nouvelleListeCartesJoueur }));
            }
        }
        else {
            setResultatManche("Egalité")
        }
    }

    const majPaquetsJoueurs = (resultatManche: String, indexCarteJoueur: number) => {
        if (resultatManche === "Perdu" && bot && joueur) {
            const nouvelleListeCartesBot = [...bot.liste_cartes];
            const nouvelleListeCartesJoueur = [...joueur.liste_cartes];
    
            const cartePerdue = nouvelleListeCartesJoueur.splice(indexCarteJoueur, 1)[0];
            nouvelleListeCartesBot.push(cartePerdue);
    
            setBot(ancienBot => ({ ...bot, score: ancienBot.score + 1, liste_cartes: nouvelleListeCartesBot }));
            setJoueur({ ...joueur, liste_cartes: nouvelleListeCartesJoueur });
        } 
        else if (resultatManche === "Gagné" && bot && joueur) {
            const nouvelleListeCartesBot = [...bot.liste_cartes];
            const nouvelleListeCartesJoueur = [...joueur.liste_cartes];
    
            const cartePerdue = nouvelleListeCartesBot.splice(0, 1)[0];
            nouvelleListeCartesJoueur.push(cartePerdue);
    
            setBot({ ...bot, liste_cartes: nouvelleListeCartesBot });
            setJoueur(ancienJoueur => ({ ...joueur, score: ancienJoueur.score + 1, liste_cartes: nouvelleListeCartesJoueur }));
        }
        else if (resultatManche === "Egalité" && bot && joueur)
        {
            
        }
    }

    const mancheSuivante = () => {
        //Reset le choix fait et le résultat de la manche précédente
        setChoixJoueur(undefined)
        setIndexBrulee(undefined)
        setIndexCarteEgalite(undefined)
        setResultatManche("")
        setCartesSelectionnees([])

        if (joueur?.liste_cartes.length === 0 || bot?.liste_cartes.length === 0) {
            alert('Le jeu est terminé !')
            setGameStarted(false)
        }
    }

    const start = () => {
        createRandomSuite()
        setGameStarted(true)
    }


    return (
        <div className="bataille-content">
            <div className='bataille-top'>
                <h1>Jeu de la bataille</h1>
                <button onClick={start} disabled={gameStarted}>Start</button>
            </div>
            {gameStarted && ( // Affiche cette section uniquement si gameStarted est true
            <div className="bataille-game-content">
                <div className='joueurs-informations'>
                    <div className="player-infos">
                        <h2>{joueur?.name} | Score : {joueur?.score}</h2>
                        <h3>Nombre de cartes restantes : {joueur?.liste_cartes.length}</h3>
                        <ul>
                            {joueur?.liste_cartes.slice(0,5).map((card, index) => (
                                <div key={index} className='joueur-carte'>
                                    <li>{getNomCarte(card.valeur)} {card.couleur}</li>
                                    <button 
                                    disabled={cartesSelectionnees.includes(index) || (resultatManche !== "" && resultatManche !== "Egalité")}// Désactiver si déjà sélectionné
                                    onClick={() => {
                                        if (resultatManche === "Egalité" && indexBrulee !== undefined) {
                                        choixCarteEgalite(index); 
                                    } else if (resultatManche === "Egalité") {
                                        choixCarteBrulee(index);
                                    } else {
                                        choixCarteJoueur(index);
                                    }
                                    }}>
                                    Choisir</button>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="bot-infos">
                        <h2>{bot?.name} | Score : {bot?.score}</h2>
                        <h3>Nombre de cartes restantes : {bot?.liste_cartes.length}</h3>
                    </div>
                </div>
                {choixJoueur !== undefined && (
                    <div className='resultat-cartes-selectionnees'>
                        <div className="cartes-selectionnees">
                            <div className='joueur-choix'>
                                <h3>Vous avez choisi : {getNomCarte(derniereCarteJoueeJoueur.valeur)} {derniereCarteJoueeJoueur.couleur} </h3>
                                {indexBrulee !== undefined && (                                
                                    <h4>Vous avez brûlé {getNomCarte(joueur?.liste_cartes[indexBrulee].valeur)} {joueur?.liste_cartes[indexBrulee].couleur}</h4>
                                )}
                                {indexCarteEgalite !== undefined && (                                
                                    <h4>Vous avez rejoué {getNomCarte(joueur?.liste_cartes[indexCarteEgalite].valeur)} {joueur?.liste_cartes[indexCarteEgalite].couleur}</h4>
                                )}                            
                            </div>
                            <div className='bot-choix'>
                                <h3>L'ordinateur a choisi : {getNomCarte(derniereCarteJoueeBot.valeur)} {derniereCarteJoueeBot.couleur}</h3>
                                {indexBrulee !== undefined && (                                
                                    <h4>L'ordinateur a brûlé {getNomCarte(bot?.liste_cartes[1].valeur)} {bot?.liste_cartes[1].couleur}</h4>
                                )}
                                {indexCarteEgalite !== undefined && (                                
                                    <h4>L'ordinateur a rejoué {getNomCarte(bot?.liste_cartes[2].valeur)} {bot?.liste_cartes[2].couleur}</h4>
                                )}   
                            </div>
                        </div>
                        <div className='resultat-manche'>
                            <h2>Résultat : {resultatManche}</h2>
                            {resultatManche !== "Egalité" && (
                                <button onClick={() => mancheSuivante()}>Manche suivante</button>
                            )}
                            {resultatManche === "Egalité" && (
                                <p>Choisir une carte à brûler puis une autre carte à jouer</p>
                            )}

                        </div>
                    </div>
                )}
                
            </div>
            )}
        </div>
    )
}

export default Bataille;