import { useEffect, useRef, useState } from "react"
import "./GiphyTranslate.css"

const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY

export default function GiphyTranslate() {
    const [searchTextPhrase, setSearchTextPhrase] = useState("")
    const [giphyImages, setGiphyImages] = useState([])
    const [weirdnessLevel, setWeirdnessLevel] = useState(1)
    const [searchEndpointOffset, setSearchEndpointOffset] = useState(1)    
    const [isSearchEndpoint,setIsSearchEndpoint] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    
    const giphyRef = useRef(null)

    const searchEndpointLimit = 20

    

    const getGiphyTranslate = () => {
        
        setIsSearchEndpoint(false)

        if (searchTextPhrase !== '') {
            const url=`https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${searchTextPhrase}}&weirdness=${weirdnessLevel}`
            fetch(url)
            .then(res => {                
                if (res.ok) {
                    res.json()
                        .then(res => {                            
                            setGiphyImages([...giphyImages, res.data])
                        }).catch(error => console.log(error))
                }
            })
        }
    }
    const getGiphySearchEndpoint = () => {
        
        const url=`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTextPhrase}}&limit=${searchEndpointLimit}&offset=${searchEndpointOffset}`

        setIsSearchEndpoint(true)

        if (searchTextPhrase !== '') {
            fetch(url)
            .then(res => {            
                if (res.ok) {                                    
                    res.json()                    
                    .then(res => {                        
                        if (res.data.length > 0) {
                            setGiphyImages([...giphyImages,...res.data])
                            setSearchEndpointOffset(searchEndpointOffset+searchEndpointLimit)    
                        } else {
                            setHasMore(false)                            
                        }
                        
                    }).catch(error => console.log(error))
                }
            })
        }
    }
    
    const handleGiphyPhraseChange = event => {        
        setSearchTextPhrase(event.target.value)
        setIsSearchEndpoint(false)
        setSearchEndpointOffset(1)
    }
    
    const getWeirdnessLevel = event => {
        setWeirdnessLevel(event.target.value)
        getGiphyTranslate()
    }

    function onIntersection (entries) {    
        const firstEntry = entries[0]    
        if (firstEntry.isIntersecting && hasMore) {
          getGiphySearchEndpoint()
        }
      }
    useEffect(()=>{

        if (isSearchEndpoint) {
            const obs = new IntersectionObserver(onIntersection)    
            if (obs && giphyRef.current) {
              obs.observe(giphyRef.current)
            }
        
            return () => {
              if (obs) {
                obs.disconnect()
              }
            }    
        }
    }, [giphyImages])    
    
    return (
        <div className="giphy_translate">
            <fieldset className="giphy_fieldset">
                <legend>Giphy Translate</legend>
                <input type="text" 
                    placeholder="enter a giphy phrase"
                    onChange={handleGiphyPhraseChange}
                    value={searchTextPhrase}
                />
                <button onClick={getGiphyTranslate} >Get Translate GIF</button>
                <button onClick={getGiphySearchEndpoint} >Get Search Endpoint GIF</button>
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
            </fieldset>
            {giphyImages.length > 0 && 
                <div className="gif_preview">
                    {giphyImages.map((gifImage, index) => <img key={index} src={gifImage.images.original.url} alt={gifImage.images.title}/>)}
                    
                    {(hasMore && isSearchEndpoint) && 
                        <div ref={giphyRef}>Giphy loading...</div>
                    }
                </div>
            }
    </div>
    )
}