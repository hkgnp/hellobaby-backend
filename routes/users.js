const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// import the User model
const { User } = require('../models');

// import the forms
const {
  createUserForm,
  bootstrapField,
  loginUserForm,
  userProfile,
} = require('../forms');

// Hash password for registration and login
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

router.get('/register', (req, res) => {
  const registrationForm = createUserForm();
  res.render('users/register', {
    form: registrationForm.toHTML(bootstrapField),
  });
});

router.post('/register', async (req, res) => {
  const registrationForm = createUserForm();
  registrationForm.handle(req, {
    success: async (form) => {
      let { confirm_password, ...userData } = form.data;

      // Hash password before sending to database
      userData.password = getHashedPassword(userData.password);

      // Create model and save user
      const newUser = new User();
      newUser.set(userData);
      await newUser.save();

      // Proceed to login user after registering
      const loginForm = loginUserForm();
      loginForm.handle(req, {
        success: async (form) => {
          // Check if user exists
          let user = await User.where({
            email: form.data.email,
          }).fetch({
            require: false,
          });

          // If user exists, check password
          if (user) {
            // Password matches, save the user to the session
            if (
              user.get('password') === getHashedPassword(form.data.password)
            ) {
              req.session.user = {
                id: user.get('id'),
                username: user.get('username'),
                email: user.get('email'),
              };
              req.flash(
                'success_messages',
                `Welcome ${req.session.user.username}! Thanks for registering!`
              );
              res.redirect('/products');
            } else {
              req.flash(
                'error_messages',
                'Your password is incorrect. Please try again'
              );
              res.redirect('/users/login');
            }
          } else {
            // If user does not exist, go to login page to try again
            req.flash(
              'error_messages',
              'Email does not exist. Please register by using the Register button below.'
            );
            res.redirect('/users/login');
          }
        },
      });
    },
    error: (form) => {
      res.render('users/register', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/login', (req, res) => {
  const registrationForm = loginUserForm();
  res.render('users/login', {
    form: registrationForm.toHTML(bootstrapField),
  });
});

router.post('/login', (req, res) => {
  const loginForm = loginUserForm();
  loginForm.handle(req, {
    success: async (form) => {
      // Check if user exists
      let user = await User.where({
        email: form.data.email,
      }).fetch({
        require: false,
      });

      // If user exists, check password
      if (user) {
        // Password matches, save the user to the session
        if (user.get('password') === getHashedPassword(form.data.password)) {
          req.session.user = {
            id: user.get('id'),
            username: user.get('username'),
            email: user.get('email'),
          };
          req.flash(
            'success_messages',
            `Welcome back ${req.session.user.username}`
          );
          res.redirect('/products');
        } else {
          req.flash(
            'error_messages',
            'Your password is incorrect. Please try again'
          );

          res.redirect('/users/login');
        }
      } else {
        // If user does not exist, go to login page to try again
        req.flash(
          'error_messages',
          'Email does not exist. Please register by using the Register button below.'
        );
        res.redirect('/users/login');
      }
    },
  });
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  req.flash('success_messages', 'You have been successfully logged out');
  res.redirect('/users/login');
});

router.get('/profile', (req, res) => {
  const userProfileForm = userProfile();
  if (req.session.user) {
    res.render('users/profile', {
      user: req.session.user,
      form: userProfileForm.toHTML(bootstrapField),
    });
  } else {
    req.flash(
      'error_messages',
      'Please log in before accessing the profile page'
    );
    res.redirect('/users/login');
  }
});

module.exports = router;
