const { format } = require('timeago.js');

const pool = require('../database');

const helpers = {};

//-- Funcion para dar formato a la fecha de creacion en modulo "intenciones"
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

//-- Funcion para colocar texto a la salida de un campo boolean en list "intenciones"
helpers.realizado = (numBool) => {
    if (numBool == 0) {
        return ('Por realizar el:') ;
    } else {
        return 'Realizado';
    }
};

helpers.fecha = (_date) => {
    var _mes = _date.getMonth() + 1;
    return _date.getDate() + '/' + _mes + '/' + _date.getFullYear();
};

helpers.fechaactual = () => {
    var _date = new Date();
    var _mes = _date.getMonth() + 1;
    var _dia = _date.getDate();
    
    if (_mes < 10) {
        var _mest = '0' + _mes.toString();
    } else {
        var _mest = _mes;
    }

    if (_dia < 10) {
        var _diat = '0' + _dia.toString();
    } else {
        var _diat = _dia;
    }
    
    var _fecact = _date.getFullYear() + '-' + _mest + '-' + _diat;
    return _fecact.toString();
};

helpers.fechaformato = (_date) => {
    var _mes = _date.getMonth() + 1;

    if (_mes < 10) {
        var _mest = '0' + _mes.toString();
    } else {
        var _mest = _mes;
    }
    var _fecact = _date.getFullYear() + '-' + _mest + '-' + _date.getDate();
    return _fecact.toString();
};

// Funcion que controla los elementos en editar para mostrar y no modificar
helpers.control = (_num) => {
    if (_num == 1) {
        return 'checked';
    } else { 
        return ' ';
    }
};

// Funcion que verifica si el usuario tiene el rol de administrador para desplegar accesos en el menu de navegacion
helpers.isAdmin = (opc) => {
    if (opc == 'A') {
        return true;
    } else {
        return false;
    }
};

// Funcion para sacar el porcentaje de avance en las metas para pintarlas en el dashboard
helpers.avance = (_meta, _logrado) => {
    var _porc = (_logrado * 100) / _meta;
    return _porc;
};

// Funcion que retorna el nombre del grupo
helpers.buscaGrupo = async (_grpCodigo) => {
    var _grpNombre = { grpNombre: ' ' };
    _grpNombre = await pool.query('SELECT grpNombre FROM grupos WHERE grpCodigo = ?', [_grpCodigo]);
    console.log(_grpNombre[0]);
    return 'valor';
};

module.exports = helpers;