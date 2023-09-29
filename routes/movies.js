import { Router } from 'express'
import { MovieController } from '../controllers/movie.js'

// Enrutado
export const moviesRouter = Router()

//El día de mañana solo quiero tocar el controlador, voy a movieController
moviesRouter.get('/', MovieController.getAll) //<-- El hecho de como se controlan estas rutas NO lo sabemos aquí, sino que es el controlador (MovieController) es el que sabe cómo tiene controlar las peliculas

moviesRouter.get('/:id', MovieController.getById)

moviesRouter.post('/', MovieController.create)

moviesRouter.patch('/:id', MovieController.update)

moviesRouter.delete('/:id', MovieController.delete)