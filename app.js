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
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', usersRouter);
app.use('/api', loginRouter);
app.use('/jitsi/api', jitsiRouter);


if (process.env.NODE_ENV=="production") {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}


// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
	res.status(404);
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

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
