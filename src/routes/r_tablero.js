const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Definiendo rutas

//-- Pintando el formulario
router.get('/stds/dashb', isLoggedIn, async (req, res) => {
    // Consultando las intenciones de CCGs realizadas
    const intCcgs = await pool.query('SELECT c.ccgNombre, c.ccgMeta, sum(i.intCantidad) as totCantidad, i.intRealizado from ccg c, intenciones i where c.ccgCodigo = i.ccgCodigo and i.intRealizado = 1 group by c.ccgCodigo');
    res.render('./stds/tablero', { intCcgs });
});

router.get('/stds/grps', isLoggedIn, async (req, res) => {
    // Consultando la BD para traer el nro de CCGs realizadas por grupo
    const ccgsGrupos = await pool.query('SELECT g.grpNombre, c.ccgNombre, c.ccgMeta, i.intCantidad FROM grupos g, ccg c, intenciones i, miembros m WHERE g.grpCodigo = m.grpCodigo and m.mbrCodigo = i.mbrCodigo and i.ccgCodigo = c.ccgCodigo and i.intRealizado = 1 ORDER BY g.grpNombre ASC');
    const ccgsTotal = await pool.query('SELECT g.grpNombre, sum(intcantidad) as ccgs from miembros m, grupos g, intenciones i where m.grpCodigo = g.grpCodigo and m.mbrCodigo = i.mbrCodigo and intRealizado = 1 group by g.grpCodigo order by ccgs DESC');
    res.render('./stds/infGrupos', { ccgsGrupos, ccgsTotal });
});

router.get('/stds/mbrs', isLoggedIn, async (req, res) => {
    // Consultando la BD para traer el nro de CCGs realizadas por persona
    const ccgsMbrs = await pool.query('SELECT g.grpNombre, mbrNombre, mbrApellidos, ccgNombre, intcantidad from miembros m, grupos g, intenciones i, ccg c where m.grpCodigo = g.grpCodigo and m.mbrCodigo = i.mbrCodigo and i.ccgCodigo = c.ccgCodigo  and intRealizado = 1 order by grpNombre');
    const ccgsTotal = await pool.query('select g.grpNombre, mbrNombre, mbrApellidos, sum(intcantidad) as ccgs from miembros m, grupos g, intenciones i, ccg c where m.grpCodigo = g.grpCodigo and m.mbrCodigo = i.mbrCodigo and i.ccgCodigo = c.ccgCodigo  and intRealizado = 1 group by m.mbrCodigo order by ccgs DESC');
    res.render('./stds/infMiembros', { ccgsMbrs, ccgsTotal });
});

module.exports = router;