import { fetchFromTMDB } from '../services/tmdb.service.js'

export async function getTrendingTV(req, res) {
    try {
        const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/tv/day?language=en-US')
        const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)]

        res.json({ sucess: true, content: randomMovie })
    } catch (error) {
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}

export async function getTVTrailers(req, res) {
    const { id } = req.params
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`)
        res.json({ sucess: true, trailers: data.results })
    } catch (error) {
        if (error.response.status === 404) {
            return res.status(404).send(null)
        }

        res.status(500).json({ sucess: false, message: 'internal server error' })

    }
}

export async function getTVDetails(req, res) {
    const { id } = req.params
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`) 
        res.json({ sucess: true, content: data })
    } catch (error) {
        if (error.response.status === 404) {
            return res.status(404).send(null)
        }

        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}

export async function getSimilarTV(req, res) {
    const { id } = req.params
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US`)
        res.json({ sucess: true, similar: data.results })
    } catch (error) {
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}

export async function getTVByCategory(req, res) {
    const { category } = req.params
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US`)
        res.json({ sucess: true, content: data.results })
    } catch (error) {
        res.status(500).json({ sucess: false, message: 'internal server error' })
    }
}