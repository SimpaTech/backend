const router = require('express').Router()

const UsuarioController = require('../controllers/UsuarioController')

router.post('/cadastrarUsuario', UsuarioController.cadastrarUsuario)

export default router;
