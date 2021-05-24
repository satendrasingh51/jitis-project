var express=require('express');
var path=require('path');
var cookieParser=require('cookie-parser');
var logger=require('morgan');
/* Connection to mongodb or Database */
var connectDB=require('./config/db');
var usersRouter=require('./routes/users');
const loginRouter=require('./routes/login');
const jitsiRouter=require('./routes/jitsi');
var app=express();

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', usersRouter);
app.use('/api', loginRouter);
app.use('/api', jitsiRouter);


// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message=err.message;
	res.locals.error=req.app.get('env')==='development'? err:{};

	// render the error page
	res.status(err.status||500);
	res.render('error');
});

module.exports=app;
