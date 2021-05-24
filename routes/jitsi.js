const express=require('express');
const auth=require('../middleware/auth');
const router=express();
const users=require('../models/users');
const crypto=require('crypto')


/**
 * @Route /create/room
 * @description Create room in jitsi
 * @access Private
 */
router.get('/create/room', async (req, res) => {
    try {
        crypto.randomBytes(32, (error, buffer) => {
            if (error) {
                console.log(error.msg)
                res.json({msg: 'Server Error'})
            }
            const token=buffer.toString("hex")
            res.json({room: `https://jitsi.meest4bharat.net/${token}`})
        });
        // const user=await users.findById(req.user.id).select('-password');
    } catch (error) {
        if (error) {
            return res.json({msg: [{msg: error.message}]})
        }
    }
})


module.exports=router;