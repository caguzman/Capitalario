// Module requirement
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

// Inicializaciones
const app = express();
require('./lib/passport'); // indicandole donde se encuentra mi archivo passport

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views')); // estableciendo path de la carpeta "views" y guardando en la variable "views"
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs'); // ejecutando el motor de handlebars

// Middlewares
app.use(session({
    secret: 'capitalmysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize()); // Inicializando passport
app.use(passport.session()); // Abriendo session para que trabaje passport


// Globals variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user; // Almacenando los datos de session del usuario

    next();
});


// Routes
// -- Estableciendo la ruta para el inicio
app.use(require('./routes/r_index'));
// -- Estableciendo la ruta para authentication
app.use(require('./routes/r_authentication'));
// -- Estableciendo la ruta para CCG
app.use('/ccgs',require('./routes/r_ccgs'));
// -- Estableciendo la ruta para grupos (grps)
app.use(require('./routes/r_grps'));
// -- Estableciendo la ruta para la opcion Intenciones
app.use(require('./routes/r_intenciones'));
// -- Estableciendo la ruta para las estadisticas
app.use(require('./routes/r_tablero'));
// -- Estableciendo la ruta para la cuenta regresiva
app.use(require('./routes/r_countdown'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port: ', app.get('port'));
});