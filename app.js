import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

const app = express()
app.disable('x-powered-by')
app.use(json())// Middleware para parsear JSON en las solicitudes POST
app.use(corsMiddleware())

//Tenemos lo justo y necesario de la app
app.use('/movies', moviesRouter)

//es IMPORTANTE asignar le puerto de esta manera, porque el puerto lo va a asignar(de forma automática) el hosting que vamos a utilizar. SIEMPRE UTILIZAR LA VARIABLE DE ENTORNO DEL PROCESO.
//pero... ¿Por que no funciona mi api? Es por esta misma razón. Si tú no utilizas el puerto que te asigna el hosting NO VA A FUNCIONAR!
const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})

