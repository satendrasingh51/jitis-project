const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const auth=require('../middleware/auth');
const adminAuth=require('../middleware/adminAuth')
const jwt=require('jsonwebtoken');
const config=require('config');
const {check, validationResult}=require('express-validator');

const User=require('../models/users');


// @route    POST api/login
// @desc     Authenticate user & get token
// @access   Public3
router.post(
  '/login/user',
  [
    check('username', 'Please include a valid Username').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {username, password}=req.body;

    try {
      let user=await User.findOne({username});

      if (!user) {
        return res
          .status(400)
          .json({errors: [{msg: 'Invalid Credentials'}]});
      }
      const isMatch=await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({errors: [{msg: 'Invalid Credentials'}]});
      }

      const payload={
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 3600},
        (err, token) => {
          if (err) throw err;
          res.json({token, msg: [{msg: 'Login successfull'}]});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


// @route    GET api/adminAuth
// @desc     Get user by token
// @access   Private
router.get('/allusers', adminAuth, async (req, res) => {
  try {
    const user=await User.find().select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


module.exports=router;
