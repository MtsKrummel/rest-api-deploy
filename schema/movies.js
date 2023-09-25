const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(["Action", "Crime", "Drama"]),
        {
            required_error: 'Movie genre is required.',
            invalid_type_error: 'Movie genre must be an array of enum Genre'
        }
    )
})

function validateMovie(input) {
    return movieSchema.safeParse(input)
}

function validatePartialMovie(object) {
    //Con partial() todos y cada uno de las propiedades que tengo en mi schema van a ser opcionales que se encuentren en mi objecto, de forma tal que si NO ESTÁ no sucede nada, pero SI ESTÁ se valida. Así estamos rreaprovechando el schema para la actualización de la película.
    // HAZ QUE TODAS LAS PROPIEDADES SEAN OPCIONALES
    return movieSchema.partial().safeParse(object)
}

//safeParse te permite validar un objeto según un esquema definido en zod y obtener información detallada sobre los errores de validación sin necesidad de manejar excepciones. Esto hace que el código sea más robusto y controlable cuando se trata de validación de datos. Por otro lado, parse lanzaría una excepción si ocurren errores de validación, lo que requeriría un manejo de excepciones más elaborado.

module.exports = {
    validateMovie,
    validatePartialMovie
}
