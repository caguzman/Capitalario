const express = require('express');
const router = express.Router();

const pool = require('../database');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth'); // Para verficar si el usr esta logueado

// Definiendo las rutas

//-- Pintando el formulario
router.get('/signup', isNotLoggedIn, async (req, res) => {
    // Consultando los datos de grupos para morstrarlo en el form
    const grps = await pool.query('SELECT * FROM grupos order by grpNombre');
    // Se lo enviamos el arreglo al form
    res.render('auth/signup', {grps});
});

//-- Preparando para almacenar en la BD
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

//-- Pintando el formulario de Login
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

//-- Pintando el formulario de ayuda
router.get('/help', (req, res) => {
    res.render('auth/help');
});

//-- Verificando los datos introducidos y cotejando con los de la BD
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

//-- Estableciendo la ruta para ver el perfil del usuario
router.get('/profile', isLoggedIn, async (req, res) => {
    res.render('profile');
});

//-- Estableciendo la ruta para terminar la session del usuario
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;