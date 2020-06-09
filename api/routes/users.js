/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const router = express.Router();


router.post('/signup', (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email already exists',
        });
      }
      // eslint-disable-next-line consistent-return
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        // eslint-disable-next-line no-shadow
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        user.save().then((result) => {
          console.log(result);
          res.status(201).json({
            message: 'User Created',
          });
        }).catch((errors) => res.status(500).json({
          error: errors,
        }));
      });
    });
});

router.post('/login', (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Authentication Failed',
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Authentication Failed',
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              // eslint-disable-next-line no-underscore-dangle
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            },
          );
          return res.status(200).json({
            message: 'Authentication Successful',
            // eslint-disable-next-line object-shorthand
            token: token,
          });
        }

        return res.status(401).json({
          message: 'Authentication Failed',
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.delete('/:userId', (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(200).json({
        message: 'User Deleted',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
