import { movieModel } from "../models/movie.js"
import { validateMovie, validatePartialMovie } from "../schema/movies.js"

export class MovieController {
    //RECORDEMOS: SI HAY UN ASYNC AWAIT DEBEMOS MANEJAR LOS ERRORES
    static async getAll(req, res) {
        //podriamos manejar los errores con try-catch pero es mejor manejas los erroes en un middleware
        const { genre } = req.query
        const movies = await movieModel.getAll({ genre }) //<-- Aquí el controlador sabe a que modelo tiene que acudir y en el modelo es el que sabe cómo recuperar las películas
        //¿Qué es lo que renderiza?
        res.json(movies)
    }

    static async getById(req, res) {
        const { id } = req.params

        const movie = await movieModel.getById({ id })

        if (movie) return res.json(movie)

        res.status(404).json({ message: 'Movie not found' })
    }

    static async create(req, res) {
        const result = validateMovie(req.body);

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }

        const newMovie = await movieModel.create({ input: result.data })

        res.status(201).json(newMovie);
    }

    static async update(req, res) {
        const result = validatePartialMovie(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params

        const updateMovie = await movieModel.update({ id, input: result.data })

        if (updateMovie === false) {
            return res.status(404).json({ message: 'Movie not found' })
        }

        res.json(updateMovie)
    }

    static async delete(req, res) {
        const { id } = req.params

        const result = await movieModel.delete({ id })

        if (result === false) {
            return res.status(404).json({ message: 'Movie not found' })
        }

        return res.json({ message: 'Movie Deleted' })
    }
}