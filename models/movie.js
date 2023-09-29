import { readJson } from '../utils.js'

const movies = readJson('./movies.json')
import { randomUUID } from 'node:crypto'
export class movieModel {
    static async getAll({ genre }) {
        if (genre) {
            return movies.filter(
                movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
        }
        
        return movies
    }

    static async getById({ id }) {
        const movie = movies.find(movie => movie.id === id)
        return movie
    }

    static async create({ input }) {
        const newMovie = {
            id: randomUUID(), // uuid v4
            ...input
        }

        movies.push(newMovie);

        return newMovie
    }

    static async delete({ id }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)

        if (movieIndex === -1) return false

        movies.splice(movieIndex, 1)

        return true
    }

    static async update({ id, input }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)

        //En JavaScript, Array.prototype.findIndex() es un método que se utiliza para encontrar el índice de un elemento en un array que cumple con una condición específica. Cuando no se encuentra ningún elemento que cumpla con la condición, este método devuelve -1 como valor predeterminado.
        if (movieIndex === -1) return false

        const updateMovie = {
            ...movies[movieIndex],
            ...input
        }

        movies[movieIndex] = updateMovie

        return updateMovie
    }
}