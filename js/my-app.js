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
var mainView = myApp.addView('.view-main');

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
				//$("#btnParkMyCar").show();
				//$("#btnAgenda").show();
				//$("#btnStatistics").show();
				//$("#btnFindMyCar").show();
				//$("#btnAddCar").hide();
			} else if (JSON.parse(responseData).data == "fail"){
				console.log("User has no car registered");
				//$("#btnParkMyCar").hide();
				//$("#btnAgenda").hide();
				//$("#btnStatistics").hide();
				//$("#btnFindMyCar").hide();
				//$("#btnAddCar").show();
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

// open index page
function openIndex(){
	mainView.router.loadPage('index.html');
	console.log('function: open index page');
}

// ------------------------
// ---- AddCar page --------
// ------------------------

// open addCar page
function openAddCar(){
	mainView.router.loadPage('VaddCar.html');
	console.log('function: open addCar page');
}

// ------------------------
// ---- Agenda page -------
// ------------------------

// open agenda page
function openAgenda(){
	mainView.router.loadPage('Vagenda.html');
	console.log('function: open agenda page');
}

// ------------------------
// ---- FindMyCar page ----
// ------------------------

// open findMyCar page
function openFindMyCar(){
	mainView.router.loadPage('VfindMyCar.html');
	console.log('function: open findMyCar page');
}

// ------------------------
// ---- ParkMyCar page ----
// ------------------------

// open parkMyCar page
function openParkMyCar(){
	mainView.router.loadPage('VparkMyCar.html');
	console.log('function: open parkMyCar page');
}

// ------------------------
// ---- Statistics page ---
// ------------------------

// open Statistics page
function openStatistics(){
	mainView.router.loadPage('Vstatistics.html');
	console.log('function: open statistics page');
}

// ------------------------
// ---- Register page -----
// ------------------------

// Navbar back button click 
$$('.back-register').on('click', function(){
	openLoginScreen();
	console.log('test');
});

// open Register pager
function openRegister(){
	mainView.router.loadPage('Vregister.html');
	console.log('function: open register page');
}
