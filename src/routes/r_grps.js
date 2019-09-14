const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Definiendo rutas

//-- Pintando el formulario
router.get('/grps/add', isLoggedIn, async (req, res) => {
    // Consultando los datos de rama para morstrarlo en el form
    const ramas = await pool.query('SELECT * FROM Rama order by rmaNombre ASC');
    // Se lo enviamos el arreglo al form
    res.render('./grps/add', {ramas});
});

//-- Definiendo la ruta para almacenar los datos
router.post('/grps/add', isLoggedIn, async (req, res) => {
    const { grpNombre, rmaCodigo } = req.body;
    const newGrp = {
        grpNombre,
        rmaCodigo
    };
    
    await pool.query('INSERT INTO grupos SET ?', [newGrp]);
    req.flash('success', 'Grupo almacenado satisfactoriamente.');
    res.redirect('/grps/list');
});

//-- Definiendo la ruta para el listado de grupos
router.get('/grps/list', isLoggedIn, async (req, res) => {
    const grps_rama = await pool.query('SELECT grpCodigo, grpNombre, rmaNombre FROM grupos g, rama r WHERE g.rmaCodigo = r.rmaCodigo order by rmaNombre, grpNombre ASC');
    res.render('./grps/list', { grps_rama });
});

//-- Estableciendo la ruta para eliminar un registro
router.get('/grps/delete/:grpCodigo', isLoggedIn, async (req, res) => {
    const { grpCodigo } = req.params;
    await pool.query('DELETE FROM grupos WHERE grpCodigo = ?', [grpCodigo]);
    req.flash('success', 'Registro eliminado satisfactoriamente.');
    res.redirect('/grps/list');
});

//-- Estableciendo la ruta para "mostrar" los datos a modificar del grupo
router.get('/grps/edit/:grpCodigo', isLoggedIn, async (req, res) => {
    const { grpCodigo } = req.params;
    const ramas = await pool.query('SELECT * FROM Rama');
    const grps = await pool.query('SELECT g.grpCodigo, g.grpNombre, g.rmaCodigo, r.rmaNombre FROM grupos g, rama r WHERE g.rmaCodigo = r.rmaCodigo and g.grpCodigo = ?', [grpCodigo]);
    res.render('./grps/edit', {grps: grps[0], ramas: ramas});
});

//-- Estableciendo la ruta para "grabar" los datos modificados a la BD
router.post('/grps/edit/:grpCodigo', isLoggedIn, async (req, res) => {
    const { grpCodigo } = req.params;
    const { grpNombre, rmaCodigo } = req.body;
    const newGrp = {
        grpNombre,
        rmaCodigo
    };

    await pool.query('UPDATE grupos SET ? WHERE grpCodigo = ?', [newGrp, grpCodigo]);
    req.flash('success', 'Datos modificados.');
    res.redirect('/grps/list');
});

module.exports = router;