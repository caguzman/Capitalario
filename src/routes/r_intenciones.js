const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//-- Definiendo rutas

//-- Estableciendo la ruta para pintar el formulario
router.get('/int/add', isLoggedIn, async (req, res) => {
    // Consultando los datos de ccg para mostrarlos en el form
    const ccgs = await pool.query('SELECT * FROM ccg order by ccgNombre ASC');
    // Se lo enviamos el arreglo al form
    res.render('./intenciones/add', { ccgs });
});

//-- Estableciendo la ruta para almacenar los datos
router.post('/int/add', isLoggedIn, async (req, res) => {
    const { ccgCodigo, mbrCodigo, intCantidad, intObservacion, intRealizado, intFechaRealizacion } = req.body;
    const newInt = {
        ccgCodigo,
        mbrCodigo,
        intCantidad,
        intObservacion,
        intRealizado,
        intFechaRealizacion
    };
    
    // debo sacar el codigo de usuario de una variable global
    newInt.mbrCodigo = req.user.mbrCodigo;
    
    //-- Controlando el switch de "Realizado" antes de almacenar
    if (newInt.intRealizado == 'on') {
        newInt.intRealizado = 1;
    } else {
        newInt.intRealizado = 0;
    };
    
    // Almacenando en la BD
    await pool.query('INSERT INTO intenciones SET ?', [newInt]);
    req.flash('success', 'Registro Grabado.');
    res.redirect('/int/list');
        
});

// Estableciendo la ruta para el listado de datos
router.get('/int/list', isLoggedIn, async (req, res) => {
    const _mbrCodigo = req.user.mbrCodigo;
    // Sacando todas las CCG no realizadas
    const intCcg0 = await pool.query('SELECT ccg.ccgCodigo, intCodigo, ccgNombre, mbrCodigo, intCantidad, intRealizado, intObservacion, intFechaRealizacion, intFechaRealizacion, intFechaCreacion FROM ccg, intenciones WHERE ccg.ccgCodigo = intenciones.ccgCodigo and intRealizado = 0 and mbrCodigo = ? order by intFechaCreacion DESC', _mbrCodigo);
    // Sacando todas las CCG realizadas
    const intCcg1 = await pool.query('SELECT ccg.ccgCodigo, intCodigo, ccgNombre, mbrCodigo, intCantidad, intRealizado, intObservacion, intFechaRealizacion, intFechaRealizacion, intFechaCreacion FROM ccg, intenciones WHERE ccg.ccgCodigo = intenciones.ccgCodigo and intRealizado = 1 and mbrCodigo = ? order by intFechaCreacion DESC', _mbrCodigo);
    res.render('./intenciones/list', { intCcg0, intCcg1 });
});

// Estableciendo la ruta para eliminar un registro de la BD
router.get('/int/delete/:intCodigo', isLoggedIn, async (req, res) => {
    const { intCodigo } = req.params;
    await pool.query('DELETE FROM intenciones WHERE intCodigo = ?', [intCodigo]);
    req.flash('success', 'Registro Eliminado.');
    res.redirect('/int/list');
});

// Estableciendo la ruta para "mostrar" los datos en el form.
router.get('/int/edit/:intCodigo', isLoggedIn, async (req, res) => {
    const { intCodigo } = req.params;
    const _mbrCodigo = req.user.mbrCodigo;
    const ccgs = await pool.query('SELECT * FROM ccg');
    const intcs = await pool.query('SELECT * FROM intenciones i, ccg c WHERE i.ccgCodigo = c.ccgCodigo and i.mbrCodigo = ? and intCodigo = ?', [_mbrCodigo, intCodigo]);
    res.render('./intenciones/edit', {intcs: intcs[0], ccgs: ccgs});
});

// Estableciendo la uta para almacenar los datos modificados en la BD
router.post('/int/edit/:intCodigo', isLoggedIn, async (req, res) => {
    const { intCodigo } = req.params;
    const { ccgCodigo, mbrCodigo, intCantidad, intRealizado, intObservacion, intFechaRealizacion } = req.body;
    const newInt = {
        ccgCodigo,
        mbrCodigo,
        intCantidad,
        intRealizado,
        intObservacion,
        intFechaRealizacion
    };
    newInt.mbrCodigo = req.user.mbrCodigo;
    
    if (newInt.intRealizado == 'on') {
        newInt.intRealizado = 1;
    } else {
        newInt.intRealizado = 0;
    };
    
    await pool.query('UPDATE intenciones SET ? WHERE intCodigo = ?', [newInt, intCodigo]);
    req.flash('success', 'Datos modificados.');
    res.redirect('/int/list');
});

module.exports = router;