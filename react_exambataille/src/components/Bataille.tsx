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

    useEffect(() => {
        if (randomPaquet.length > 0) {
            createPlayers();
        }   
    }, [randomPaquet])



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

        console.log(mainJoueur)
        console.log(mainBot)

        setJoueur({name:"Moi", score:0, liste_cartes: mainJoueur})
        setBot({name:"bot", score:0, liste_cartes: mainBot})
    }

    const start = () => {
        createRandomSuite()
        setGameStarted(true)
    }


    return (
        <div className="bataille-content">
            <div className='bataille-top'>
                <h1>Jeu de la bataille</h1>
                <button onClick={start}>Start</button>
            </div>
            {gameStarted && ( // Affiche cette section uniquement si gameStarted est true
            <div className="bataille-game-content">
                <div className="player-infos">
                    <p>{joueur?.name} {joueur?.score}</p>
                    <ul>
                        {joueur?.liste_cartes.map((card, index) => (
                            <li key={index}>{card.valeur} {card.couleur}</li>
                        ))}
                    </ul>
                </div>
                <div className="bot-info">
                    <p>{bot?.name} {bot?.score}</p>
                    <ul>
                        {bot?.liste_cartes.map((card, index) => (
                            <li key={index}>{card.valeur} {card.couleur}</li>
                        ))}
                    </ul>
                </div>
            </div>
            )}
        </div>
    )
}

export default Bataille;