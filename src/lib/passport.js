const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

// Definiendo
// -- Login (SignIn)
passport.use('local.signin', new LocalStrategy({
    usernameField: 'mbrUsuario',
    passwordField: 'mbrPassword',
    passReqToCallback: true
}, async (req, mbrUsuario, mbrPassword, done) => {
    const rows = await pool.query('SELECT * FROM miembros WHERE mbrUsuario = ?', [mbrUsuario]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(mbrPassword, user.mbrPassword);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido(a) ' + user.mbrNombre));
        } else {
            done(null, false, req.flash('message', 'Password Incorrecto.'));
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario no existe.'));
    }
}));

// -- Registro (SignUp)
passport.use('local.signup', new LocalStrategy({
    usernameField: 'mbrUsuario',
    passwordField: 'mbrPassword',
    passReqToCallback: true
}, async (req, mbrUsuario, mbrPassword, done) => {
    const { mbrNombre, mbrApellidos, mbrEmail, mbrTelefono, grpCodigo, mbrRol } = req.body;
    const newUser = {
        mbrNombre,
        mbrApellidos,
        mbrUsuario,
        mbrPassword,
        mbrEmail,
        mbrTelefono,
        grpCodigo,
        mbrRol
    };

    // Validando que el nombre de usuario no exista
    const rows = await pool.query('SELECT * FROM miembros WHERE mbrUsuario = ?', [mbrUsuario]);
    if (rows.length > 0) {
        return done(null, false, req.flash('message', 'El nombre de usuario ya existe. Intente otro.'));
    } else {
        // Almacenando los datos en la BD
        // Encriptando el password
        newUser.mbrPassword = await helpers.encryptPassword(mbrPassword);
        // Definiendo el rol como USUARIO
        newUser.mbrRol = 'U';
        const result = await pool.query('INSERT INTO miembros SET ?', [newUser]);
        newUser.mbrCodigo = result.insertId;
        return done(null, newUser);
    }
}));

// Serializando
passport.serializeUser((user, done) => {
    done(null, user.mbrCodigo);
});

// Deserializando
passport.deserializeUser(async (mbrCodigo, done) => {
    const rows = await pool.query('SELECT * FROM miembros WHERE mbrCodigo = ?', [mbrCodigo]);
    done(null, rows[0]);
});