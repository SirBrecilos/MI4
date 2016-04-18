// ------------------------
// ---- my-app.js ---------
// ------------------------

// Initialize your app
var myApp = new Framework7({
  pushState: true
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
var lat = 0;
var long = 0;

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
				PHPcallCheckCar1();
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
function PHPcallCheckCar1() {
	var data = {};
	data.email = userLoggedIn;
	data.format = "json";
	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=checkCarOwner",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log("User has a car registered as owner");
				$$("#btn-addCar").hide();
				$$("#btn-findMyCar").show();
				$$("#btn-agenda").show();
				$$("#btn-statistics").show();
				$$("#btn-parkMyCar").show();
			} else if (JSON.parse(responseData).data == "fail"){
				PHPcallCheckCar2();
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

function PHPcallCheckCar2() {
	var data = {};
	data.email = userLoggedIn;
	data.format = "json";
	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=checkCarUser",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log("User has a car registered as user");
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

// click addCar button
$$('#btn-addCarForm').on('click', function(){
	if (checkFieldsAddCar()){
		PHPcallRegisterCar();
	} else {
		console.log('field error');
	}
});

// open addCar page
function openAddCar(){
	mainView.router.load({pageName: 'addCar'});;
	console.log('function: open addCar page');
}

// check fields for correct data
// if yes -> return true
// if no -> return false
function checkFieldsAddCar(){
	var merk = document.getElementById('addCar-merk').value;
	var nummerplaat = document.getElementById('addCar-nummerplaat').value;
	var kilometers = document.getElementById('addCar-kilometers').value;
	
	if (merk == "") {
		console.log("merk is emty");
		document.getElementById('addCar-merk').focus();
		return false;
	}
	if (nummerplaat == "") {
		console.log("nummerplaat is emty");
		document.getElementById('addCar-nummerplaat').focus();
		return false;
	}
	if (kilometers == "") {
		console.log("kilometers is emty");
		document.getElementById('addCar-kilometers').focus();
		return false;
	}
	
	var REtext = /^[\w ]+$/;
	var RElicenceplate = /^[A-Za-z0-9\-]+$/;
	var REdigits = /^[0-9]+$/;
	
	if (!REtext.test(merk)) {
		console.log("merk contains invalid characters");
		document.getElementById('addCar-merk').focus();
		return false;
	}
	if (!RElicenceplate.test(nummerplaat)) {
		console.log("nummerplaat contains invalid characters");
		document.getElementById('addCar-nummerplaat').focus();
		return false;
	}
	if (!REdigits.test(kilometers)) {
		console.log("kilometers contains invalid characters");
		document.getElementById('addCar-kilometers').focus();
		return false;
	}
	return true;
}

// PHPcall for adding a car
function PHPcallRegisterCar() {
	var data = {};
	data.merk = document.getElementById('addCar-merk').value;
	data.nummerplaat = document.getElementById('addCar-nummerplaat').value;
	data.km = document.getElementById('addCar-kilometers').value;
	data.email = userLoggedIn;
	data.format = "json";
	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=registerCar",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log("success registration new car");
				PHPcallCheckCar1();
				openIndex();
			}
			if (JSON.parse(responseData).data == "db error"){
				console.log("failed registration new car");
			}
		},
		error: function (responseData, textStatus, errorThrown) {
			console.log("fout " + errorThrown);
		}
	});
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

// getCoords button click
$$('#findCar-findCar').on('click', function(){
	PHPcallFindCar();
});

// open findMyCar page
function openFindMyCar(){
	mainView.router.load({pageName: 'findCar'});
	console.log('function: open findMyCar page');
}

// PHPcall find car 
function PHPcallFindCar() {
	var data = {};
	data.format = "json";
	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=findCar",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log(JSON.parse(responseData).data);
				console.log("longitude: " + JSON.parse(responseData).coords.longitude);
				console.log("latitude: " + JSON.parse(responseData).coords.latitude);
				document.getElementById('findCar-long').value = JSON.parse(responseData).coords.longitude;
				document.getElementById('findCar-lat').value = JSON.parse(responseData).coords.latitude;
			}
			if (JSON.parse(responseData).data == "db error"){
				console.log("failed getting coords");
			}
		},
		error: function (responseData, textStatus, errorThrown) {
			console.log("fout " + errorThrown);
		}
	});
}

// ------------------------
// ---- ParkMyCar page ----
// ------------------------

// getCoords button click
$$('#parkCar-getCoords').on('click', function(){
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
});

// parkCar button click
$$('#parkCar-parkCar').on('click', function(){
	if (checkInputFields()){
		PHPcallParkCar();
	}
});

// check of coords zijn opgehaald
function checkInputFields(){
	var lat2 = document.getElementById('parkCar-lat').value;
	var long2 = document.getElementById('parkCar-long').value;
	var km2 = document.getElementById('parkCar-km').value;
	var fuel2 = document.getElementById('parkCar-fuel').value;
	
	if (lat2 == 0 || lat2 == null ){
		console.log('geen lat-coord opgegeven');
		return false;
	}
	if (long2 == 0 || long2 == null ){
		console.log('geen long-coord opgegeven');
		return false;
	}
	if (km2 == 0 || km2 == null ){
		console.log('geen km opgegeven');
		return false;
	}
	if (fuel2 == 0 || fuel2 == null ){
		document.getElementById('parkCar-fuel').value = 0;
	}
	return true;
}

// navigator.geolocation onSuccus function
function onSuccess(position){
	console.log('in onSuccess()');
	lat = position.coords.latitude;
	console.log("latitude: " + lat);
	long = position.coords.longitude;
	console.log("longitude: " + long);
	document.getElementById('parkCar-lat').value = lat;
	document.getElementById('parkCar-long').value = long;
}

// navigator.geolocation onError function
function onError(error){
	console.log('in onError()');
	console.log('error-code: ' + error.code);
	console.log('error-message: ' + error.message);
}

// PHPcall parkCar
function PHPcallParkCar() {
	var data = {};
	data.kmDriven = document.getElementById('parkCar-km').value;
	data.fuelAdded = document.getElementById('parkCar-fuel').value;
	data.long = document.getElementById('parkCar-long').value;
	data.lat = document.getElementById('parkCar-lat').value;
	data.email = userLoggedIn;
	data.format = "json";

	$$.ajax({
		type: "POST",
		url: apiAddress + "?m=parkCar",
		crossDomain: true,
		data: data,
		withCredentials: false,
		success: function (responseData, textStatus, jqXHR) {
			console.log(JSON.parse(responseData));
			if (JSON.parse(responseData).data == "success"){
				console.log("success perkeergegevens toegevoegd");
				openIndex();
			}
			if (JSON.parse(responseData).data == "db error"){
				console.log("failed adding parking stuff");
			}
		},
		error: function (responseData, textStatus, errorThrown) {
			console.log("fout " + errorThrown);
		}
	});
}

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
	if (checkFieldsRegister()){
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

// check if fields have correct data
// if yes -> return true
// if no -> return false
function checkFieldsRegister(){
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
	var REemail = /[a-zA-Z0-9]+(?:(\.|_)[A-Za-z0-9!#$%&'*+/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
	var RElicenceplate = /([A-Za-z0-9\-]+)/;
	var REdigits = /^[0-9]+$/;
	
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

// PHPcall register user
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