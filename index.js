const express = require('express');
const hbs = require('hbs');
const moment = require('moment');
const wax = require('wax-on');
require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const csurf = require('csurf');

// create an instance of express app
let app = express();

// set the view engine
app.set('view engine', 'hbs');
app.use(cors());

// static folder
app.use(express.static('public'));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

//eq
require('handlebars-helpers')({
  handlebars: hbs.handlebars,
});

// date time
hbs.registerHelper('dateFormat', function (date, options) {
  const formatToUse =
    (arguments[1] && arguments[1].hash && arguments[1].hash.format) ||
    'DD/MM/YYYY';
  return moment(date).format(formatToUse);
});

hbs.registerHelper('if_eq', function (a, b, options) {
  if (a === b) return options.fn(this);
  else return options.inverse(this);
});

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

// set up session
app.use(
  session({
    // Secret key for the session. Needs to be complex.
    secret: process.env.SESSION_SECRET_KEY,
    // Will not resave the session if there are no changes to the session
    resave: false,
    // If a user comes in without a session, immediately create one
    saveUninitialized: true,
  })
);

// Set up flash
app.use(flash());

// Set up csurf
// Create instance of csurf to only be used in some circumstances
const csurfInstance = csurf();
// Create custom middleware so that when processing payment, csrf token is not used.
app.use((req, res, next) => {
  if (
    req.url === '/checkout/process_payment' ||
    req.url.slice(0, 5) === '/api/'
  ) {
    return next();
  }
  csurfInstance(req, res, next);
});

app.use((err, req, res, next) => {
  if (err) {
    req.flash(
      'error_messages',
      'The form has expired. Please reload your page.'
    );
    res.redirect('back');
  } else {
    next();
  }
});

// Set up middleware
// Middleware is something that sits between the route and the user

// Flash messages middleware
app.use((req, res, next) => {
  // Inject success and error messages into the hbs file
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

// User session middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// req.csrfToken
app.use((req, res, next) => {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

// API routes
const api = {
  products: require('./routes/api/products'),
  users: require('./routes/api/users'),
  cart: require('./routes/api/cart'),
  checkout: require('./routes/api/checkout'),
};

const landingRoutes = require('./routes/landing');
const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary');
const shoppingCartRoutes = require('./routes/shoppingCart');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/orders');

(async () => {
  app.use('/', landingRoutes);
  app.use('/products', productsRoutes);
  app.use('/users', userRoutes);
  app.use('/cloudinary', cloudinaryRoutes);
  app.use('/cart', shoppingCartRoutes);
  app.use('/checkout', checkoutRoutes);
  app.use('/orders', orderRoutes);
  app.use('/api/products', express.json(), api.products);
  app.use('/api/users', express.json(), api.users);
  app.use('/api/cart', express.json(), api.cart);
  app.use('/api/checkout', express.json(), api.checkout);
})();

// Set server port
const portNumber = 7000;
app.listen(process.env.PORT || portNumber, () =>
  console.log('Server is running on port ' + portNumber)
);
