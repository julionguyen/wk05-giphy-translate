import { useState } from "react"
import "./GiphyTranslate.css"

const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY

export default function GiphyTranslate() {
    const [txtPhrase, setTxtPhrase] = useState("")
    const [translateImage, setTranslateImage] = useState(null)
    const [weirdnessLevel, setWeirdnessLevel] = useState(1)

    const getGiphyTranslate = () => {
        if (txtPhrase !== '') {
            fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${txtPhrase}}&weirdness=${weirdnessLevel}`)
            .then(res => res.json())
            .then(res => setTranslateImage(res.data.images.original.url))
        }
    }
    const handleGiphyPhraseChange = event => {
        setTxtPhrase(event.target.value)
    }
    const getWeirdnessLevel = event => {
        setWeirdnessLevel(event.target.value)
    }
    console.log('Phrase: ', txtPhrase, 'Weirdness Level: ', weirdnessLevel)
    return (
        <div className="giphy_translate">
            <input type="text" 
                placeholder="enter a giphy phrase"
                onChange={handleGiphyPhraseChange}
                value={txtPhrase}
            />
            <button onClick={getGiphyTranslate} >Get Giphy GIF</button>
            <label>Weirdness: </label>
            <select onChange={getWeirdnessLevel} value={weirdnessLevel}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
            {translateImage && <div><img src={translateImage}/></div>}
        </div>
    )
}