// ------------------------
// ---- my-app.js ---------
// ------------------------

// Initialize your app
var myApp = new Framework7({
  pushState: true,
  material: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    domCache: true //enable inline pages
});

// Other variables
var userLoggedIn = '';
var apiAddress = "http://bvbmi3.netau.net/php.php";

// ------------------------
// ---- Login screen ------
// ------------------------

// Login-button click
$$('.check-login').on('click', function(){
	PHPcallLoginUser();
});

// Register-button click
$$('.register-login').on('click', function(){
	closeLoginScreen();
	openRegister();
});

// open login-screen
function openLoginScreen(){
	myApp.loginScreen();
	console.log('function: open login screen');
}

// close login screen 
function closeLoginScreen(){
	myApp.closeModal();
	console.log('function: close login screen');
}

// check login-data (PHPCALL)
// if correct -> log in to index-page
// if false -> ...
function PHPcallLoginUser() {
	var data = {};
	data.email = $$('#email-login').val();
	data.password = $$('#password-login').val();
	data.format = "json";
	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=login",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log("login succes");
				userLoggedIn = data.email;
				console.log("user logged in: " + userLoggedIn);
				PHPcallCheckCar();
				openIndex();
				closeLoginScreen();
			} else if (JSON.parse(responseData).data == "fail"){
				console.log("login failed");
			}
			else {
				console.log(JSON.parse(responseData).data);
			}
		},
		error: function (responseData, textStatus, errorThrown) {
			console.log("fout: " + errorThrown);
		}
	});
}

// check if user has a car registered (PHPCALL)
// if yes -> show main buttons (findCar - agenda - statistics - parkCar)
// if no -> only show addCar button
function PHPcallCheckCar() {
	var data = {};
	data.email = userLoggedIn;
	data.format = "json";
	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=checkCar",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log("User has a car registered");
				$$("#btn-addCar").hide();
				$$("#btn-findMyCar").show();
				$$("#btn-agenda").show();
				$$("#btn-statistics").show();
				$$("#btn-parkMyCar").show();
			} else if (JSON.parse(responseData).data == "fail"){
				console.log("User has no car registered");
				$$("#btn-addCar").show();
				$$("#btn-findMyCar").hide();
				$$("#btn-agenda").hide();
				$$("#btn-statistics").hide();
				$$("#btn-parkMyCar").hide();
			}
			else {
				console.log(JSON.parse(responseData).data);
			}
		},
		error: function (responseData, textStatus, errorThrown) {
			console.log("fout: " + errorThrown);
		}
	});
}

// ------------------------
// ---- Index page --------
// ------------------------

// click on Add Car button
$$('#btn-addCar').on('click', function(){
	openAddCar();
	checkUserLoggedIn();
});

// click on Find Car button
$$('#btn-findMyCar').on('click', function(){
	openFindMyCar();
	checkUserLoggedIn();
});

// click on Agenda button
$$('#btn-agenda').on('click', function(){
	openAgenda();
	checkUserLoggedIn();
});

// click on Statistics button
$$('#btn-statistics').on('click', function(){
	openStatistics();
	checkUserLoggedIn();
});

// click on Park Car button
$$('#btn-parkMyCar').on('click', function(){
	openParkMyCar();
	checkUserLoggedIn();
});

// open index page
function openIndex(){
	mainView.router.load({pageName: 'index'});
	console.log('function: open index page');
}

// ------------------------
// ---- AddCar page -------
// ------------------------

// open addCar page
function openAddCar(){
	mainView.router.load({pageName: 'addCar'});;
	console.log('function: open addCar page');
}

// ------------------------
// ---- Agenda page -------
// ------------------------

// test button click
$$('#btn-test').on('click', function(){
	console.log('test');
});

// open agenda page
function openAgenda(){
	mainView.router.load({pageName: 'agenda'});
	console.log('function: open agenda page');
}

// ------------------------
// ---- FindMyCar page ----
// ------------------------

// open findMyCar page
function openFindMyCar(){
	mainView.router.load({pageName: 'findCar'});
	console.log('function: open findMyCar page');
}

// ------------------------
// ---- ParkMyCar page ----
// ------------------------

// open parkMyCar page
function openParkMyCar(){
	mainView.router.load({pageName: 'parkCar'});
	console.log('function: open parkMyCar page');
}

// ------------------------
// ---- Statistics page ---
// ------------------------

// open Statistics page
function openStatistics(){
	mainView.router.load({pageName: 'statistics'});
	console.log('function: open statistics page');
}

// ------------------------
// ---- Register page -----
// ------------------------

// click register button
$$('#btn-registerForm').on('click', function(){
	if (checkFields()){
		PHPcallRegisterUser();
	} else {
		console.log('field error');
	}
});

// open Register pager
function openRegister(){
	mainView.router.load({pageName: 'register'});
	console.log('function: open register page');
}

function checkFields(){
	var name = document.getElementById('register-name').value;
	var surname = document.getElementById('register-surname').value;
	var email = document.getElementById('register-email').value;
	var password1 = document.getElementById('register-password1').value;
	var password2 = document.getElementById('register-password2').value;
	
	if (name == "") {
		console.log("name is emty");
		document.getElementById('register-name').focus();
		return false;
	}
	if (surname == "") {
		console.log("surname is emty");
		document.getElementById('register-surname').focus();
		return false;
	}
	if (email == "") {
		console.log("email is emty");
		document.getElementById('register-email').focus();
		return false;
	}
	if (password1 == "") {
		console.log("password is emty");
		document.getElementById('register-password1').focus();
		return false;
	}
	if (password2 == "") {
		console.log("password is emty");
		document.getElementById('register-password2').focus();
		return false;
	}
	
	var REtext = /^[\w ]+$/;
	var REemail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
	
	if (!REtext.test(name)) {
		console.log("name contains invalid characters");
		document.getElementById('register-name').focus();
		return false;
	}
	if (!REtext.test(surname)) {
		console.log("surname contains invalid characters");
		document.getElementById('register-surname').focus();
		return false;
	}
	if (!REemail.test(email)) {
		console.log("email contains invalid characters");
		document.getElementById('register-email').focus();
		return false;
	}
	console.log(password1 + " & " + password2);
	if (password1 != password2) {
		console.log("passwords do not match");
		document.getElementById('register-password2').focus();
		return false;
	}
	
	return true;
}

function PHPcallRegisterUser() {
	var data = {};
	data.name = document.getElementById('register-name').value;
	data.surname = document.getElementById('register-surname').value;
	data.email = document.getElementById('register-email').value;
	data.password = document.getElementById('register-password1').value;
	data.format = "json";

	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=register",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log("success registration new user");
				openLoginScreen();
			}
			if (JSON.parse(responseData).data == "fail"){
				console.log("error registration new user");
			}
		},
		error: function (responseData, textStatus, errorThrown) {
			console.log("fout " + errorThrown);
		}
	});
}

// ------------------------
// ---- Extra functions  --
// ------------------------

// check if a user is logged in on every page init
// if yes -> do nothing
// if no -> show login-page
function checkUserLoggedIn() {
	if (userLoggedIn == ''){
		openLoginScreen();
	} else
		console.log('user logged in: ' + userLoggedIn);
}