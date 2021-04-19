const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const getUserDataLayer = require('../../dal/users');

// import the User model
const { User, BlacklistedToken } = require('../../models');
const { checkIfLoggedInJWT } = require('../../middleware');

const generateAccessToken = (user, secret, expiresIn) => {
  return jwt.sign(user, secret, {
    expiresIn: expiresIn,
  });
};

// Hash password for registration and login
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

router.post('/register', async (req, res) => {
  let { ...userData } = req.body;

  let user = await getUserDataLayer.getUserByEmail(userData.email);

  if (user) {
    res.status(400);
    res.send({
      message: 'Email is already taken. Please choose another email.',
    });
  } else {
    // Hash the password
    userData.password = getHashedPassword(userData.password);

    // Create model and save user
    const newUser = new User();
    newUser.set(userData);
    await newUser.save();

    res.send({
      message: 'User registered successfully',
    });
  }
});

router.post('/login', async (req, res) => {
  let user = await User.where({
    email: req.body.email,
    role_id: 2,
  }).fetch({
    require: false,
  });

  if (user && user.get('password') === getHashedPassword(req.body.password)) {
    let accessToken = generateAccessToken(
      {
        username: user.get('username'),
        email: user.get('email'),
        id: user.get('id'),
      },
      process.env.TOKEN_SECRET,
      '15m'
    );

    let refreshToken = generateAccessToken(
      {
        username: user.get('username'),
        email: user.get('email'),
        id: user.get('id'),
      },
      process.env.REFRESH_TOKEN_SECRET,
      '7d'
    );

    res.send({ accessToken, refreshToken });
  } else {
    res.status(401);
    res.send({
      error: 'Invalid email or password',
    });
  }
});

router.get('/profile', checkIfLoggedInJWT, async (req, res) => {
  let user = await getUserDataLayer.getUserByEmail(req.user.email);

  let { password, ...userDetails } = user.toJSON();

  res.send({
    user: userDetails,
  });
});

router.post('/updateprofile', async (req, res) => {
  let userData = { ...req.body };
  let user = await getUserDataLayer.getUserByEmail(userData.email);

  if (user) {
    user.set(userData, { patch: true });
    await user.save();
  } else {
    return null;
  }

  res.send({
    message: 'Profile updated successfully',
  });
});

router.post('/refresh', async (req, res) => {
  let refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.sendStatus(401);
  }

  // check if token has been blacklisted
  let blacklistedToken = await BlacklistedToken.where({
    token: refreshToken,
  }).fetch({
    require: false,
  });

  if (blacklistedToken) {
    res.status(401);
    res.send('Token has been blacklisted');
    return;
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let accessToken = generateAccessToken(
        {
          username: user.username,
          email: user.email,
          id: user.id,
        },
        process.env.TOKEN_SECRET,
        '15m'
      );
      res.send({
        accessToken,
      });
    }
  });
});

router.post('/logout', async (req, res) => {
  let refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.sendStatus(401);
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const token = new BlacklistedToken();
        token.set('token', refreshToken);
        token.set('date_created', new Date());
        await token.save();
        res.send({
          message: 'You have been logged out',
        });
      }
    }
  );
});

module.exports = router;
