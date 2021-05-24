const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const jitiShema=new mongoose.Schema({
    room: {
        type: String
    },
    fullname: {
        type: String
    },
    roomCreateBy: {
        type: ObjectId,
        ref: 'user'
    },
    email: {
        type: String
    },
    room_url: {
        type: String
    }
});

module.exports=Jitsi=mongoose.model('jitsi', jitiShema);