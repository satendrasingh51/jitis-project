const express=require('express');
const auth=require('../middleware/auth');
const router=express();
const Jitsi=require('../models/jitsi');


/**
 * @Route /jitsi/api/
 * @description Create room in jitsi
 * @access Private
 */
router.post('/', auth, async (req, res) => {
    try {
        const {room, fullname, email, }=req.body;
        if (!room||!fullname||!email) {
            return res.json({msg: [{msg: 'All field is required'}]})
        }
        const newRoom=new Jitsi({
            room,
            roomCreateBy: req.user.id,
            room_url: `https://jitsi.meest4bharat.net/${room}`,
            fullname,
            email
        })
        await newRoom.save();
        res.json({room, msg: [{msg: 'Room Create successfull'}]})
    } catch (error) {
        if (error) {
            return res.json({msg: [{msg: error.message}]})
        }
    }
})
/**
 * @Route /jitsi/api/with/mysqldb
 * @description Create room in jitsi
 * @access public
 */
// router.post('/mysqldb', async (req, res) => {
//     try {
//         const {room, fullname, email, }=req.body;
//         if (!room||!fullname||!email) {
//             return res.json({msg: [{msg: 'All field is required'}]})
//         }
//         var sql="INSERT INTO jitsitable (room, fullname, room_url, email) VALUES ?";
//         const values=[room, fullname, `https://jitsi.meest4bharat.net/${room}`, email]
//         jistiTable.query(sql,[values], function(err, result) {
//             if (err) throw err;
//             console.log("1 record inserted");
//             res.json({result, msg: [{msg: 'Room Create successfull'}]})
//         });
//     } catch (error) {
//         if (error) {
//             return res.json({msg: [{msg: error.message}]})
//         }
//     }
// })


module.exports=router;