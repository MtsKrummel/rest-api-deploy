import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:1234',
    'https://movies.com',
    'https://midu.dev'
]

//Aquí se define una función llamada corsMiddleware que acepta un objeto como argumento. Este objeto tiene una propiedad llamada acceptedOrigins que, si se proporciona, reemplazará el valor por defecto que es ACCEPTED_ORIGINS.

// El = {} al final de ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) es una técnica de desestructuración de argumentos con un valor por defecto. Significa que si no se proporciona un objeto como argumento, se creará un objeto vacío por defecto. Si se proporciona un objeto con la propiedad acceptedOrigins, se usará ese valor en lugar de ACCEPTED_ORIGINS.
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        // @ts-ignore
        if (acceptedOrigins.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
})