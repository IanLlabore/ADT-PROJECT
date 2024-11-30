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

//database config
$database = new Database("localhost", "movieProjectDb", "root", "");
$database->getConnection();
$user_gateway = new UserGateway($database);

$codec = new JWTCodec;

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

        // Authenticate access token for other admin actions
        if (!$auth->authenticateAccessToken()) {
            exit;
        }

        switch ($action) {
            case 'movies':
                $id = $parts[4] ?? null;
                $gateway = new AdminMovieGateway($database);
                $controller = new AdminMovieController($gateway, $auth);
                $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
                break;

            // Handle other admin actions (user, casts, photos)
            // Add more cases here for admin actions like 'user', 'casts', 'photos', etc.

            default:
                http_response_code(404);
                echo json_encode(['message' => 'Endpoint not found']);
                exit;
        }
        break;

    case 'user':
        // user endpoint
        $action = $parts[3] ?? null;
        if ($action === null) {
            http_response_code(404);
            echo json_encode(['message' => 'Action is missing.']);
            exit;
        }

        // Handle login action for the user endpoint
        if ($action === 'login') {
            // Handle login logic
            $controller = new UserController($user_gateway);
            $controller->processRequest($_SERVER["REQUEST_METHOD"], 'login');
            break;
        }

        // Handle user registration logic
        if ($action === 'register') {
            // Handle user registration logic
            $controller = new UserController($user_gateway);
            $controller->processRequest($_SERVER["REQUEST_METHOD"], 'register');
            break;
        }

        // Add more user-related actions if needed
        break;

    case 'movies':
        // Movies endpoint
        $id = $parts[3] ?? null;
        $gateway = new MovieGateway($database);
        $controller = new MovieController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'photos':
        // Photos endpoint
        $id = $parts[3] ?? null;
        $gateway = new PhotosGateway($database);
        $controller = new PhotosController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'videos':
        // Videos endpoint
        $id = $parts[3] ?? null;
        $gateway = new VideosGateway($database);
        $controller = new VideosController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'casts':
        // Casts endpoint
        $id = $parts[3] ?? null;
        $gateway = new CastsGateway($database);
        $controller = new CastsController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint not found']);
        exit;
}
