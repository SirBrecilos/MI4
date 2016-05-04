<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// ----------------------------------------------------- Step 0: Connect to database ---------------------------------------------------------------
$servername = "mysql7.000webhost.com";
$username = "a3711306_BVB"; // dangerous
$password = "sdfSDF123";
$dbname = "a3711306_MI3"; // standaard test databank

// Define API response codes and their related HTTP response
$api_response_code = array(0 => array('HTTP Response' => 400, 'Message' => 'Unknown Error'), 1 => array('HTTP Response' => 200, 'Message' => 'Success'), 2 => array('HTTP Response' => 403, 'Message' => 'HTTPS Required'), 3 => array('HTTP Response' => 401, 'Message' => 'Authentication Required'), 4 => array('HTTP Response' => 401, 'Message' => 'Authentication Failed'), 5 => array('HTTP Response' => 404, 'Message' => 'Invalid Request'), 6 => array('HTTP Response' => 400, 'Message' => 'Invalid Response Format'), 7 => array('HTTP Response' => 400, 'Message' => 'DB problems'));

// Set default HTTP response of 'ok' or NOK in this case
$response['code'] = 0;
$response['status'] = 400;
$response['data'] = NULL;

// Define whether an HTTPS connection is required
$HTTPS_required = FALSE;

// Define whether user authentication is required
$authentication_required = FALSE; // staat nu op false. Test dit eens met true, en geef de nodige login credentials mee

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname) or die(mysqli_connect_error());


// ----------------------------------------------------- Step 1: Initialize variables and functions ---------------------------------------------------------------

///**
// * Deliver HTTP Response
// * @param string $format The desired HTTP response content type: [json, html, xml]
// * @param string $api_response The desired HTTP response data
// * @return void
// **/

function deliver_response($format, $api_response){

    // Define HTTP responses
    $http_response_code = array(200 => 'OK', 400 => 'Bad Request', 401 => 'Unauthorized', 403 => 'Forbidden', 404 => 'Not Found');

    // Set HTTP Response
    header('HTTP/1.1 ' . $api_response['status'] . ' ' . $http_response_code[$api_response['status']]);
    
    // Process different content types
    if (strcasecmp($format, 'json') == 0) {

        // Set HTTP Response Content Type
        header('Content-Type: application/json; charset=utf-8');

        // Format data into a JSON response
        $json_response = json_encode($api_response);

        // Deliver formatted data
        echo $json_response;

    } elseif (strcasecmp($format, 'xml') == 0) {

        // Set HTTP Response Content Type
        header('Content-Type: application/xml; charset=utf-8');

        // Format data into an XML response (This is only good at handling string data, not arrays)
        $xml_response = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<response>' . "\n" . "\t" . '<code>' . $api_response['code'] . '</code>' . "\n" . "\t" . '<data>' . $api_response['data'] . '</data>' . "\n" . '</response>';

        // Deliver formatted data
        echo $xml_response;

    } else {

        // Set HTTP Response Content Type (This is only good at handling string data, not arrays)
        header('Content-Type: text/html; charset=utf-8');

        // Deliver formatted data
        echo $api_response['data'];

    }

    // End script process
    exit ;

}

// ----------------------------------------------------- Step 2: Authorization ---------------------------------------------------------------

// Optionally require connections to be made via HTTPS
if ($HTTPS_required && $_SERVER['HTTPS'] != 'on') {
    $response['code'] = 2;
    $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
    $response['data'] = $api_response_code[$response['code']]['Message'];

    // Return Response to browser. This will exit the script.
    deliver_response($_GET['format'], $response);
}


// ----------------------------------------------------- Step 3: Process Request ---------------------------------------------------------------

/* 
    Register a new account
    
    needed param:
        - name
        - surname
        - email
        - password
*/
if (strcasecmp($_GET['m'], 'register') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "INSERT INTO CarSharing_Users (Name, Surname, Email, Password) 
                VALUES ('" . $_POST['name'] . "', '" . $_POST['surname'] . "', '" . $_POST['email'] . "', '"  . $_POST['password'] . "')";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
        }
    }
}

/* 
    Login als geregistreerde user
    
    needed param:
        - email
        - password
*/
if (strcasecmp($_GET['m'], 'login') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT * 
                FROM CarSharing_Users 
                WHERE Email LIKE '" . $_POST['email'] . "' AND Password LIKE '" . $_POST['password'] . "'";
                
        $result = $conn -> query($sql);
        $rows = array();
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            while ($row = $result -> fetch_assoc()) {
                $rows[] = $row;
            }
            if (count($rows) > 0) {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "success";
            } else {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "fail";
            }
        }
    }
}

/*
    Check of user al een car heeft geregistreerd als CarOwned
    
    needed param:
        - email
*/
if (strcasecmp($_GET['m'], 'checkCarOwner') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT * 
                FROM CarSharing_Users 
                WHERE Email LIKE '" . $_POST['email'] . "' AND CarIdOwned IS NOT NULL";
        
        $result = $conn -> query($sql);
        $rows = array();
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            while ($row = $result -> fetch_assoc()) {
                $rows[] = $row;
            }
            if (count($rows) > 0) {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "success";
            } else {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "fail";
            }
        }
    }
}

/*
    Check of user al een car heeft geregistreerd als CarUsing
    
    needed param:
        - email
*/
if (strcasecmp($_GET['m'], 'checkCarUser') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT * 
                FROM CarSharing_Users 
                WHERE Email LIKE '" . $_POST['email'] . "' AND CarIdUsing IS NOT NULL";
        
        $result = $conn -> query($sql);
        $rows = array();
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            while ($row = $result -> fetch_assoc()) {
                $rows[] = $row;
            }
            if (count($rows) > 0) {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "success";
            } else {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "fail";
            }
        }
    }
}

/*
    Toevoegen van een auto

    needed param:
        - nummerplaat
        - merk
        - km
*/
if (strcasecmp($_GET['m'], 'registerCar') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "INSERT INTO CarSharing_Cars (Licenceplate, Brand, KmInit) 
                VALUES ('" . $_POST['nummerplaat'] . "', '" . $_POST['merk'] . "', '" . $_POST['km'] . "')";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
        }
    }
}

/*
    Ophalen van car ID van de juist geregistreerde auto ahv nummerplaat en kmInit
    
    needed param:
        - nummerplaat
        - km
*/
if (strcasecmp($_GET['m'], 'findCarId1') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT ID
                FROM CarSharing_Cars
                WHERE Licenceplate LIKE '" . $_POST['nummerplaat'] . "' AND KmInit LIKE '" . $_POST['km'] . "'";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
            $response['result_id'] = mysqli_fetch_object($result);
        }
    }
}

/*
    Ophalen van car ID door middel van email als Owner
    
    needed param:
        - email
*/
if (strcasecmp($_GET['m'], 'findCarId2') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT CarIdOwned
                FROM CarSharing_Users
                WHERE Email LIKE '" . $_POST['email'] . "'";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
            $response['result_id'] = mysqli_fetch_object($result);
        }
    }
}

/*
    Ophalen van car ID door middel van email als User
    
    needed param:
        - email
*/
if (strcasecmp($_GET['m'], 'findCarId3') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT CarIdUsing
                FROM CarSharing_Users
                WHERE Email LIKE '" . $_POST['email'] . "'";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
            $response['result_id'] = mysqli_fetch_object($result);
        }
    }
}

/*
    Ophalen van car ID door middel van key
    
    needed param:
        - email
*/
if (strcasecmp($_GET['m'], 'findCarId4') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT CarId
                FROM CarSharing_Keys
                WHERE `Key` LIKE '" . $_POST['key'] . "'";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
            $response['result_id'] = mysqli_fetch_object($result);
        }
    }
}

/*
    Ophalen van user ID door middel van email
    
    needed param:
        - email
*/
if (strcasecmp($_GET['m'], 'findUserId') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT ID
                FROM CarSharing_Users
                WHERE Email LIKE '" . $_POST['email'] . "'";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
            $response['result_id'] = mysqli_fetch_object($result);
        }
    }
}

/* 
    Updaten van user tabel met carID als Owner
    
    needed param:
        - id 
        - email
*/
if (strcasecmp($_GET['m'], 'updateUserOwned') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "UPDATE CarSharing_Users
                SET CarIdOwned = '" . $_POST['id'] . "'
                WHERE Email = '" . $_POST['email'] . "'";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
        }
    }
}

/* 
    Updaten van user tabel met carID als User
    
    needed param:
        - id 
        - email
*/
if (strcasecmp($_GET['m'], 'updateUserUsing') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "UPDATE CarSharing_Users
                SET CarIdUsing = '" . $_POST['id'] . "'
                WHERE Email = '" . $_POST['email'] . "'";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
        }
    }
}

/* 
    Ophalen van laatste kmTotal
    
    needed param: 
        - userId
*/
if (strcasecmp($_GET['m'], 'findKmTotal') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT KmTotal 
                FROM CarSharing_CarUpdates
                WHERE CarId = '" . $_POST['carId'] . "'
                ORDER BY ID DESC LIMIT 1";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
            $response['km'] = mysqli_fetch_object($result);
        }
    }
}

/* 
    Updaten van tabel CarUpdates
    
    needed param: 
        - email
        - carId
        - kmTotal
        - kmPrev
        - fuelAdded
        - longitude
        - latitude
        - userId
*/
if (strcasecmp($_GET['m'], 'updateCar') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "INSERT INTO CarSharing_CarUpdates (CarId, KmTotal, KmPrev, FuelAdded, UserId, Longitude, Latitude, Date) 
                VALUES ('" . $_POST['carId'] . "', '" . $_POST['kmTotal'] . "', '" . $_POST['kmPrev'] . "', '" . $_POST['fuelAdded'] . "', '" . $_POST['userId'] . "', '" . $_POST['longitude'] . "', '" . $_POST['latitude'] . "', NOW())";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
        }
    }
}

/*
    Vind de laatste coordinaten van je wagen
    
    needed param:
        - carId
*/
if (strcasecmp($_GET['m'], 'findCar') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT Longitude, Latitude 
                FROM CarSharing_CarUpdates
                WHERE CarId = '" . $_POST['carId'] . "'
                ORDER BY ID DESC LIMIT 1";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
            $response['coords'] = mysqli_fetch_object($result);
        }
    }
}

/*
    Create key zodat users 24h lang zich kunne toevoegen aan deze auto
    
    needed param:
        - userId
        - carId
        - key
*/
if (strcasecmp($_GET['m'], 'createKey') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "INSERT INTO CarSharing_Keys (`UserId`, `CarId`, `Key`, `Start`, `End`)
                VALUES ('" . $_POST['userId'] . "', '" . $_POST['carId'] . "', '" . $_POST['key']. "',NOW() , NOW()+INTERVAL 1 DAY)";
        
        $result = $conn -> query($sql);
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            $response['data'] = "success";
        }
    }
}

/* 
    Check key
    
    needed param:
        - key
*/
if (strcasecmp($_GET['m'], 'checkKey') == 0) {
    if (!$conn) {
        $response['code'] = 0;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = mysqli_connect_error();
    } else {
        $response['code'] = 1;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        
        $sql = "SELECT * 
                FROM CarSharing_Keys 
                WHERE `Key` LIKE '" . $_POST['key'] . "' AND `Start` <= NOW() AND `End` >= NOW()";
                
        $result = $conn -> query($sql);
        $rows = array();
        
        if (!$result) {
            $response['data'] = "db error";
        } else {
            while ($row = $result -> fetch_assoc()) {
                $rows[] = $row;
            }
            if (count($rows) > 0) {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "success";
            } else {
                $response['code'] = 1;
                $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
                $response['data'] = "fail";
            }
        }
    }
}


/*
    Agenda reservatie maken
    
    needed param:
        - 
*/


mysqli_close($conn);

// ----------------------------------------------------- Step 4: Deliver Response ---------------------------------------------------------------
deliver_response($_POST['format'], $response);

?>	