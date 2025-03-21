import { User } from "../models/user.model.js"
import { fetchFromTMDB } from "../services/tmdb.service.js"

export async function searchPerson(req, res) {
    const { query } = req.params
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`)

        if (data.results.length === 0) {
            return res.status(404).send(null)
        }

        await User.findByIdAndUpdate(req.user._id , { 
            $push: { 
                searchHistory: {
                    id: data.results[0].id,
                    image: data.results[0].profile_path,
                    title: data.results[0].name,
                    searchType: 'person',
                    createdAt: new Date()
                }
            } 
            
        })

        res.json({ sucess: true, content: data.results })
    } catch (error) {
        console.log("Error in searchPerson controller: ", error.message)
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}

export async function searchMovie(req, res) {
    const { query } = req.params
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`)

        if (data.results.length === 0) {
            return res.status(404).send(null)
        }

        await User.findByIdAndUpdate(req.user._id , { 
            $push: { 
                searchHistory: {
                    id: data.results[0].id,
                    image: data.results[0].poster_path,
                    title: data.results[0].title,
                    searchType: 'movie',
                    createdAt: new Date()
                }
            } 
            
        })

        res.json({ sucess: true, content: data.results })
    } catch (error) {
        console.log("Error in searchMovie controller: ", error.message)
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
} 

export async function searchTV(req, res) {
    const { query } = req.params
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`)

        if (data.results.length === 0) {
            return res.status(404).send(null)
        }

        await User.findByIdAndUpdate(req.user._id , { 
            $push: { 
                searchHistory: {
                    id: data.results[0].id,
                    image: data.results[0].poster_path,
                    title: data.results[0].name,
                    searchType: 'tv',
                    createdAt: new Date()
                }
            } 
            
        })

        res.json({ sucess: true, content: data.results })
    } catch (error) {
        console.log("Error in searchTV controller: ", error.message)
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}

export async function getSearchHistory(req, res) {
    try {
        res.status(200).json({ sucess: true, content: req.user.searchHistory })
    } catch (error) {
        console.log("Error in getSearchHistory controller: ", error.message)
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}

export async function deleteSearchHistory(req, res) {
    let { id } = req.params
    id = parseInt(id)
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { searchHistory: { id: id }}
        })

        res.status(200).json({ sucess: true, message: 'search history item deleted' })          
    } catch (error) {
        console.log("Error in deleteSearchHistory controller: ", error.message)
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}