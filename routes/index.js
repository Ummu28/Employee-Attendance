var express = require('express');
var router = express.Router();
var app = express();
var User = require('../models/user');
// var Booking = require('../models/appointment');
// var nodemailer = require('nodemailer');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

router.get('/dashboard', function (req, res, next) {
	return res.render('dashboard.ejs');
});


router.get('/signup', function (req, res, next) {
	return res.render('signup.ejs');
});




router.get('/form', function (req, res, next) {
	return res.render('form.ejs');
});

router.get('/employee', function (req, res, next) {
	User.find((err, docs) => {
		if (!err) {
			res.render("admin/employee.ejs", {
				data: docs
			});
		} else {
			console.log(err);
		}
	});

});

router.get('/attendance', function (req, res, next) {
	return res.render('attendance.ejs');
});

router.get('/attReport', function (req, res, next) {
	return res.render('attReport.ejs');
});

router.get('/leave', function (req, res, next) {
	return res.render('leave.ejs');
});

router.get('/report', function (req, res, next) {
	return res.render('report.ejs');
});

router.get('/chart', function (req, res, next) {
	return res.render('chart.ejs');
});

router.get('/table', function (req, res, next) {
	return res.render('table.ejs');
});

router.get('/404', function (req, res, next) {
	return res.render('404.ejs');
});

router.get('/button', function (req, res, next) {
	return res.render('button.ejs');
});

router.get('/typography', function (req, res, next) {
	return res.render('typography.ejs');
});

router.get('/adminAtt', function (req, res, next) {
	return res.render('admin/adminAtt.ejs');
});

router.get('/profile', function (req, res, next) {
	return res.render('profile.ejs');
});

router.get('/adminLeave', function (req, res, next) {
	return res.render('admin/adminLeave.ejs');
});



router.get('/editProfile/:id', function (req, res, next) { 
	
	User.findOne(({_id: req.params.id}), (err, docs) => {
		if (!err) {
			console.log(docs);
			res.render("admin/editProfile.ejs", {
				data: docs
			});
		} else {
			console.log('Failed to retrieve the booking List: ' + err);
		}
	});

	
});

router.get('/adminReport', function (req, res, next) {
	return res.render('admin/adminReport.ejs');
});

router.get('/clock', function (req, res, next) {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	//var formatted = dt.format('Y-m-d H:M:S');
	var formatted = dt.format('d-m-Y   H:M');


	return res.render('clock.ejs', {
		cur_time: formatted
	});

});

//https://github.com/nooraiman/Sales-Record-System/blob/main/products/index.php

//router.post('/clock', (req, res)=>{

//var dateTime = require('node-datetime');
//var dt = dateTime.create();
//var formatted = dt.format('Y-m-d H:M:S');

// Save current time when user login into the database
//res.render('clock.ejs',  {cur_time: formatted});
//res.json({"cur_time": formatted})

//});




//app.listen(3000, () => console.log(`App listening on port 3000`))
//---------------------------------------------------------------------------------

//-----------------------------------------ADD EMPLOYEE -----------------------------

router.post('/addEmp', function (req, res, next) { //registration
	console.log(req.body);
	var personInfo = req.body;
	if (!personInfo.name || !personInfo.email || !personInfo.passwd || !personInfo.passwdConf ||
		!personInfo.dob || !personInfo.gender || !personInfo.city || !personInfo.noHp || !personInfo.dateJoin) {
		res.send();
	} else {
		if (personInfo.passwd == personInfo.passwdConf) {
			User.findOne({
				email: personInfo.email
			}, (err, result) => {

				if (!result) {
					var newPerson = new User({
						username: personInfo.username,
						email: personInfo.email,
						passwd: personInfo.passwd,
						passwdConf: personInfo.passwdConf,
						dob: personInfo.dob,
						gender: personInfo.gender,
						city: personInfo.city,
						noHp: personInfo.noHp,
						dateJoin: personInfo.dateJoin
					});

					newPerson.save(function (err, Person) {
						if (err)
							res.json({
								status: "x ok"
							})
						else
							//res.json({status: "ok"})
							res.redirect('/employee');
					});

				}

			})

		} else {
			res.send({
				"Success1": "password is not matched"
			});
		}

	}
});


//----------------------------------------------------------
//--------------------------EDIT Employee------------------------------

router.get('/editEmp', function (req, res, next) {
	//let id = req.params.unique_id;
	console.log("Edit employee");
	User.findOne({
		_id: req.session.userId
	}, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/employee');
		} else {
			console.log("found");
			return res.render('admin/employee.ejs', {
				"id": data.unique_id,
				"username": data.username,
				"name": data.fullname,
				"email": data.email,
				"passwd": data.passwd,
				"dob": data.dob,
				"gender": data.gender,
				"city": data.city,
				"noHp": data.noHp,
				"dateJoin": data.dateJoin

			});
		}
	});
});

router.post('/editEmp', function (req, res, next) {
	// Create Mongose Method to Update a Existing Record Into Collection

	var data = {
		name: req.body.name,
		phone: req.body.phone,
		dob: req.body.dob,
		city: req.body.city,
		email: req.body.email
	}
	// Save User
	User.findByIdAndUpdate({
		_id: req.session.userId
	}, data, function (err, docs) {
		if (err) throw err
		else {
			console.log(docs);
			res.redirect('/profile');
		}

	});
});



router.get('/setting', function (req, res, next) {
	console.log(req.session.user);
	return res.render('admin/setting.ejs');
});



const admin = {
	email: "admin@gmail.com",
	passwd: "admin123",
}

router.get('/adminIndex', function (req, res, next) {
	return res.render('admin/adminIndex.ejs');
});



// ------------------------------------- LOGIN ------------------------------------------

router.post('/login', (req, res) => {

	if (req.body.email == admin.email && req.body.passwd == admin.passwd) {
		req.session.user = req.body.email;
		res.redirect('/adminIndex');

	} else {
		User.findOne({
			email: req.body.email
		}, function (err, data) {
			if (data.email == req.body.email && data.passwd == req.body.passwd) {
				req.session.userId = data._id;
				console.log("session = " + req.session.userId);
				res.redirect('/dashboard');

			} else {
				res.end("Invalid Username")
			}
		})
	};
});



// ------------------------------------- LOGIN ------------------------------------------


router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});


//------------------------------------------------ADMIN------------------------------------------------------------------------------






module.exports = router;