<?php
declare(strict_types=1);
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow React frontend (localhost:3000)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
    }

//run `composer dump-autoload` to create autoload files
require __DIR__ . "/vendor/autoload.php";

set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");

header("Content-type: application/json; charset=UTF-8");

//explode function converts the string to array
$parts = explode("/", $_SERVER["REQUEST_URI"]);

// $http_authorization = $_SERVER["HTTP_AUTHORIZATION"];

//other way of getting the autorization header
// $header = apache_request_headers();
// $http_authorization = $header["Authorization"];

//database config
$database = new Database("localhost", "movieProjectDb", "root", "");
$database->getConnection();
$user_gateway = new UserGateway($database);

$codec = new JWTCodec;

header("Access-Control-Allow-Origin: *");

$auth = new Auth($user_gateway, $codec);

if (!(($parts[2] === 'user' && $parts[3] === 'register'))) {
    // Check access token for other endpoints
    if (($parts[2] !== 'user' && $parts[2] !== 'admin') && ($_SERVER["REQUEST_METHOD"] === "POST" || $_SERVER["REQUEST_METHOD"] === "DELETE" || $_SERVER["REQUEST_METHOD"] === "PATCH")) {
        if (!$auth->authenticateAccessToken()) {
            exit;
        }
    }
}
switch ($parts[2]) {
    case 'admin':
        // Admin endpoint
        $action = $parts[3] ?? null;
        if ($action === null) {
            http_response_code(404);
            echo json_encode(['message' => 'Action not specified']);
            exit;
        }

        // Handle login and register routes for admin
        if ($parts[3] === 'user' && $parts[4] === 'register') {
            // Handle user registration logic
            $controller = new UserController($user_gateway);
            $controller->processRequest($_SERVER["REQUEST_METHOD"], 'register');
            break;
        }

        // Authenticate access token for other admin actions
        if (!$auth->authenticateAccessToken()) {
            exit;
        }

        // Admin actions such as 'movies', 'user', etc.
        switch ($action) {
            case 'movies':
                $id = $parts[4] ?? null;
                $gateway = new AdminMovieGateway($database);
                $controller = new AdminMovieController($gateway, $auth);
                $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
                break;

            case 'user':
                // Handle user registration, login, and profile actions
                if ($parts[4] === 'register') {
                    $controller = new UserController($user_gateway);
                    $controller->processRequest($_SERVER["REQUEST_METHOD"], 'register');
                    break;
                }
                // Add more user-related actions if needed
                break;

            case 'casts':
                $id = $parts[4] ?? null;
                $movieId = $parts[5] ?? null;
                $gateway = new AdminCastsGateway($database);
                $controller = new AdminCastsController($gateway, $auth);
                $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
                break;

            case 'photos':
                $id = $parts[4] ?? null;
                $gateway = new AdminPhotosGateway($database);
                $controller = new AdminPhotosController($gateway, $auth);
                $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
                break;

            default:
                http_response_code(404);
                echo json_encode(['message' => 'Endpoint not found']);
                exit;
        }
        break;

    case 'user':
        //user endpoint
        $action = $parts[3] ?? null;
        if ($action === null) {
            http_response_code(404);
            echo "Action is missing."; // Debugging output for missing action
            exit;
        }
        
        echo "User endpoint hit! Action: $action"; // Debugging output for valid action


        $gateway = new UserGateway($database);

        $controller = new UserController($gateway);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $action);
        break;

    case 'movies':
        //movies endpoint
        $id = $parts[3] ?? null;

        $gateway = new MovieGateway($database); //database

        $controller = new MovieController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'photos':
        //photos endpoint
        $id = $parts[3] ?? null;

        $gateway = new PhotosGateway($database);

        $controller = new PhotosController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'videos':
        //videos endpoint
        $id = $parts[3] ?? null;

        $gateway = new VideosGateway($database);

        $controller = new VideosController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'casts':
        //casts endpoint
        $id = $parts[3] ?? null;

        $gateway = new CastsGateway($database);

        $controller = new CastsController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;


    default:
        http_response_code(404);
        exit;
}