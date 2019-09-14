// Archivo inicial para inicializar y bifurcar las rutas de la aplicacion

// Requirmiento de modulos
const express = require('express');
const router = express.Router();

// Definiendo las rutas

//-- Ruta inicial
router.get('/', (req, res) => {
    res.render('index');
});

// Retornando salida con la configuracion de la ruta
module.exports = router;