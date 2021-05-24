const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const {check, validationResult}=require('express-validator');
const crypto=require('crypto')
const User=require('../models/users');


// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/create',
  [
    check('username', 'UserName is required')
      .not()
      .isEmpty(),
    check('fullname', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').not().isEmpty(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({min: 6}),
  ],
  async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({msg: errors.array()});
    }
    const {username, fullname, email, password,}=req.body;

    try {
      let user=await User.findOne({username});
      let useremail=await User.findOne({email});

      if (user) {
        return res
          .status(400)
          .json({msg: [{msg: 'Your are Username already exists, please try again'}]});
      }
      if (useremail) {
        return res
          .status(400)
          .json({msg: [{msg: 'Your are Email already exists, please try again'}]});
      }

      user=new User({
        username,
        fullname,
        email,
        password,
      });

      const salt=await bcrypt.genSalt(10);

      user.password=await bcrypt.hash(password, salt);
      await user.save();

      const payload={
        user: {
          id: user.id,
          fullname: user.fullname,
        }
      };
      jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600},
        (err, token) => {
          if (err) {
            res.json({msg: [{msg: err}]});
          } else {
            res.json({userdata: user})
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send({msg: [{msg: 'Something Error Please try again later.'}]});
      if (res.status==503) {
        res.json({msg: [{msg: err.message}]});
      }
    }
  }
);

module.exports=router;
