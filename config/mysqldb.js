const mysql=require('mysql');
const connectDB=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jitsi'
})

connectDB.connect((err) => {
    if (err) {
        return console.log(err);
    } else {
        return console.log('Database Connected!');
    }
})

module.exports=connectDB;