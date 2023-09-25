const express = require('express')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schema/movies')
const cryto = require('crypto')
const cors = require('cors')

const app = express()
app.disable('x-powered-by')
app.use(express.json())// Middleware para parsear JSON en las solicitudes POST

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234',
            'https://movies.com',
            'https://midu.dev'
        ]

        // @ts-ignore
        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}))

app.get('/movies', (req, res) => {
    res.json(movies)
})

// app.get('/movies/:id', (req, res) => {
//     const { id } = req.params

//     const movie = movies.find(m => m.id === id)

//     if (movie) return res.json(movie)

//     res.status(404).json({ message: 'Movie not found' })
// })

//PROBLEMAS CON POST:
//A la hora de crear una película a través de una solicitud POST surge un problema en la validación de los datos de entrada del servidor Node.js. Seguramente veas algo como esto:
// {
//     "error": [
//       {
//         "code": "invalid_type",
//         "expected": "object",
//         "received": "undefined",
//         "path": [],
//         "message": "Required"
//       }
//     ]
//   }
/*
    Este error indica que el servidor esperaba recibir un objeto (en este caso, la película que estás tratando de crear) pero recibió undefined en su lugar.

    El problema radica en cómo estás manejando la solicitud POST y validando los datos en tu archivo app.js. Para solucionar este problema, debes asegurarte de que el cuerpo de la solicitud POST contenga datos válidos en formato JSON. Veamos algunas correcciones que puedes hacer:

    1.  Asegúrate de que estás enviando la solicitud POST con el encabezado Content-Type: application/json para indicar que el cuerpo de la solicitud contiene datos JSON.

    2.  Modifica el manejo de la solicitud POST en tu archivo app.js para que parsee el cuerpo de la solicitud como JSON. Esto se puede hacer utilizando el middleware express.json().
*/

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body);

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = {
        id: cryto.randomUUID(), // uuid v4
        ...result.data
    }

    movies.push(newMovie);

    res.status(201).json(newMovie);
})
// PERO... ¿QUÉ ES ES MIDDLEWARE?
// En Express.js, un middleware es una función que se ejecuta durante el ciclo de procesamiento de una solicitud HTTP. Estas funciones tienen acceso a los objetos request (solicitud) y response (respuesta) y pueden realizar tareas como la manipulación de datos, la autorización, el registro, la validación y más. Los middleware se utilizan para modularizar y organizar el código de una aplicación web en capas o funciones reutilizables.

// Cada middleware tiene la capacidad de:

// 1.   Ejecutar código antes de que se maneje una ruta específica.
// 2.   Realizar modificaciones en la solicitud (request) o la respuesta (response).
// 3.   Terminar el ciclo de solicitud-respuesta o pasar el control al siguiente middleware en la cadena.

//.use es un método de instancia proporcionado por Express.js que se utiliza para registrar middleware en la aplicación Express. Puede recibir uno o varios argumentos, que son funciones middleware, y los agrega a la cadena de middleware que se ejecuta para todas las solicitudes entrantes. Esto significa que el middleware registrado con .use se ejecutará en TODAS las rutas o rutas específicas que coincidan con el patrón que define. O sea que sirve para configurar middleware que se aplicará a todas las solicitudes. .use incluyen:

// 1.   Middleware de registro de solicitudes: Puedes usar .use para registrar un middleware que registre información sobre cada solicitud que llega, como la hora, el método HTTP utilizado, la URL, etc.

// 2.   Middleware de autenticación: Puedes configurar middleware de autenticación global que verifica la identidad del usuario en todas las solicitudes.

// 3.   Middleware de manejo de errores: Puedes registrar un middleware de manejo de errores global que captura y maneja cualquier error que se produzca durante el procesamiento de una solicitud.

// 4.   Middleware para recursos estáticos: Express tiene un middleware incorporado llamado express.static que se puede configurar utilizando .use para servir archivos estáticos, como imágenes, CSS o JavaScript, en una aplicación web.

app.patch('/movies/:id', (req, res) => {

    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    //En JavaScript, Array.prototype.findIndex() es un método que se utiliza para encontrar el índice de un elemento en un array que cumple con una condición específica. Cuando no se encuentra ningún elemento que cumpla con la condición, este método devuelve -1 como valor predeterminado.
    if (movieIndex === -1) {
        res.status(404).json({ message: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    res.json(updateMovie)

})
//¿Cual es la diferencia entre POST, PUT Y PATCH?
//  Hay algo que tienes que tener en cuenta y es la IDEMPOTENCIA: Propiedad de realizar una acción determinada varias veces y que SIEMPRE te dará el mismo resultado. 2+2=4
//  Es importante saber si tienes funciones que son idempotentes, por más que las llames siempre tienes el mismo resultado. ej: Funciones puras.
//  La idempotencia tambien tiene que ver con el estado interno que pueden tener las cosas.
//  POST / PUT / PATCH -> Van a tener diferentes idempotencias

// ¿CÚAL ES EL PROPOSITO DE POST? Crear un nuevo elemento/recurso. ESTE NO ES IDEMPOTENTE PORQUE CREA SIEMPRE UN NUEVO RECURSO

// ¿CÚAL ES EL PROPOSITO DE PUT? Actualizar totalmente un elemento que ya existe o crearlo sino existe, o sea, cambia todo. SI ES IDEMPOTENTE PORQUE POR MÁS VECES QUE HAGAS LA MISMA SOLICITUD PUT IDÉNTICA A LA MISMA URL, EL RESULTADO SIEMPRE ES SERÁ EL MISMO PORQUE CUANDO ESTAS PASANDO LOS DATOS NO ESTAS CREANDO OTRO RECURSO.

// ¿CÚAL ES EL PROPOSITO DE PATCH? Cambiar parcialmente un elemento/recurso, o sea, MODIFICAR SOLO UNA PARTE. En un principio es idempotente. Normalmente podría ser idempotente pero DEPENDE. Si tienes un campo "updatedAt" que por lo que sea, cada vez que tú actualizas ese recurso, el updatedAt ha cambiado.

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie Deleted' })
})

//es IMPORTANTE asignar le puerto de esta manera, porque el puerto lo va a asignar(de forma automática) el hosting que vamos a utilizar. SIEMPRE UTILIZAR LA VARIABLE DE ENTORNO DEL PROCESO.
//pero... ¿Por que no funciona mi api? Es por esta misma razón. Si tú no utilizas el puerto que te asigna el hosting NO VA A FUNCIONAR!
const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})



