const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth'); // para verificar si el usr esta logueado

// Definiendo rutas

//-- Pintando el formulario
router.get('/add', isLoggedIn, (req, res) => {
    res.render('ccgs/add');
});

//-- Guardando los datos en la BD
router.post('/add', isLoggedIn, async (req, res) => {
    const { ccgNombre, ccgMeta, ccgObservacion } = req.body;
    const newCcg = {
        ccgNombre,
        ccgMeta,
        ccgObservacion
    };
    
    await pool.query('INSERT INTO ccg SET ?', [newCcg]);
    req.flash('success', 'Registro grabado exitosamente.');
    res.redirect('list');
});

//-- Listando los datos guardados en la BD
router.get('/list', isLoggedIn, async (req, res) => {
    const ccgs = await pool.query('SELECT * FROM ccg order by ccgNombre ASC');
    res.render('ccgs/list', { ccgs });
});

//-- Estableciendo la ruta para eliminar un registro
router.get('/delete/:ccgCodigo', isLoggedIn, async (req, res) => {
    const { ccgCodigo } = req.params;
    await pool.query('DELETE FROM ccg WHERE ccgCodigo = ?', [ccgCodigo]);
    req.flash('success', 'Registro eliminado correctamente.');
    res.redirect('../list');
});

//-- Estableciendo la ruta para "mostrar" los datos a modificar de un registro
router.get('/edit/:ccgCodigo', isLoggedIn, async (req, res) => {
    const { ccgCodigo } = req.params;
    const ccgs = await pool.query('SELECT * FROM ccg WHERE ccgCodigo = ?', [ccgCodigo]);
    res.render('ccgs/edit', {ccgs: ccgs[0]});
});

//-- Estableciendo la ruta para modificar los datos actualizados en la BD
router.post('/edit/:ccgCodigo', isLoggedIn, async (req, res) => {
    const { ccgCodigo } = req.params;
    const { ccgNombre, ccgMeta, ccgObservacion } = req.body;
    const newCcg = {
        ccgNombre,
        ccgMeta,
        ccgObservacion
    };
    await pool.query('UPDATE ccg SET ? WHERE ccgCodigo = ?', [newCcg, ccgCodigo]);
    req.flash('success', 'Registro actualizado exitosamente.');
    res.redirect('../list');
});

module.exports = router;