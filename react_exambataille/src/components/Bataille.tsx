import './Bataille.css'
import { useState, useEffect } from "react"

type Carte = {
    valeur: number
    couleur: string
}

type Joueur = {
    name: string
    score: number
    liste_cartes: Carte[]
}


const Bataille = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const couleurs = ["Coeur", "Carreau", "Pique", "Trefle"]
    const valeurs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11 12 13 14 représentent Valets Dames Rois et As
    const [randomPaquet, setRandomPaquet] = useState<Carte[]>([])
    const [joueur, setJoueur] = useState<Joueur>()
    const [bot, setBot] = useState<Joueur>()

    const [choixJoueur, setChoixJoueur] = useState<number>()
    const [choixBot, setChoixBot] = useState<number>()
    const [resultatManche, setResultatManche] = useState<String>("")

    useEffect(() => {
        if (randomPaquet.length > 0) {
            createPlayers();
        }   
    }, [randomPaquet])

    useEffect(() => {
        console.log(joueur?.liste_cartes)
    }, [joueur])

    useEffect(() => {
        console.log(bot?.liste_cartes)
    }, [bot])


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
        console.log(randomPaquet)
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
        if (!joueur || !joueur.liste_cartes || !bot || index >= joueur.liste_cartes.length) {
            console.error("Joueur, bot, ou leurs cartes sont undefined, ou l'index est invalide.");
            return;
        }

        setChoixJoueur(index)

        //Generation d'un index random entre 0 et 4 pour creer un choix aleatoire du bot
        const randomIndex = Math.floor(Math.random() * 4) + 0    
        setChoixBot(randomIndex);

        const carteJoueur = joueur.liste_cartes[index]
        const carteBot = bot.liste_cartes[randomIndex]
        console.log(carteJoueur)
        console.log(carteBot)

        let resultat: String;
        if (carteJoueur.valeur > carteBot.valeur) {
            resultat = "Gagné";
        } else if (carteJoueur.valeur < carteBot.valeur) {
            resultat = "Perdu";
        } else {
            resultat = "Egalité";
        }
    
        setResultatManche(resultat); // Met à jour le résultat
        majPaquetsJoueurs(resultat, index, choixBot);    
    }

    const majPaquetsJoueurs = (resultatManche: String, indexCarteJoueur: number, indexCarteBot: number) => {
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
    
            const cartePerdue = nouvelleListeCartesBot.splice(indexCarteBot, 1)[0];
            nouvelleListeCartesJoueur.push(cartePerdue);
    
            setBot({ ...bot, liste_cartes: nouvelleListeCartesBot });
            setJoueur(ancienJoueur => ({ ...joueur, score: ancienJoueur.score + 1, liste_cartes: nouvelleListeCartesJoueur }));
        }
    }

    const mancheSuivante = () => {
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
                        <h2>{joueur?.name} : {joueur?.score}</h2>
                        <h3>Nombre de cartes restantes : {joueur?.liste_cartes.length}</h3>
                        <ul>
                            {joueur?.liste_cartes.slice(0,5).map((card, index) => (
                                <div key={index} className='joueur-carte'>
                                    <li>{card.valeur} {card.couleur}</li>
                                    <button onClick={() => choixCarteJoueur(index)}>Choisir</button>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="bot-infos">
                        <h2>{bot?.name} : {bot?.score}</h2>
                        <h3>Nombre de cartes restantes : {bot?.liste_cartes.length}</h3>
                        <ul>
                            {bot?.liste_cartes.slice(0,5).map((card, index) => (
                                <div key={index} className='bot-carte'>
                                    <li key={index}>{card.valeur} {card.couleur}</li>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
                {choixJoueur !== undefined && choixBot !== undefined && (
                    <div className='resultat-cartes-selectionnees'>
                        <div className="cartes-selectionnees">
                            <div className='joueur-choix'>
                                <h3>Vous avez choisi : {joueur?.liste_cartes[choixJoueur].valeur} {joueur?.liste_cartes[choixJoueur].couleur}</h3>
                            </div>
                            <div className='bot-choix'>
                                <h3>L'ordinateur a choisi : {bot?.liste_cartes[choixBot].valeur} {bot?.liste_cartes[choixBot].couleur}</h3>
                            </div>
                        </div>
                        <div className='resultat-manche'>
                            <h2>Résultat : {resultatManche}</h2>
                            <button>Manche suivante</button>
                        </div>
                    </div>
                )}
                
            </div>
            )}
        </div>
    )
}

export default Bataille;