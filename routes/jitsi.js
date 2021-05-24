const express=require('express');
const auth=require('../middleware/auth');
const router=express();
const users=require('../models/users');


/**
 * @Route /create/room
 * @description Create room in jitsi
 * @access Private
 */
router.get('/create/room', auth, async (req, res) => {
    try {
        const user=await users.findById(req.user.id).select('-password');
        res.json({room: `https://jitsi.meest4bharat.net/${user.id}`})
    } catch (error) {
        if (error) {
            return res.json({msg: [{msg: error.message}]})
        }
    }
})


module.exports=router;