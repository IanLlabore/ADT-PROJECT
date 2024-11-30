<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
class UserController
{
    public function __construct(private UserGateway $gateway)
    {
    }

    public function processRequest(string $method, string $action): void
    {
        if ($method === 'POST') {
            switch ($action) {
                case "login":
                    echo "Calling processLoginRequest()"; // Debugging output
                    $this->processLoginRequest();
                    break;

                case "register":
                    echo "Calling processLoginRequest()"; // Debugging output
                    $this->processRegistrationRequest();
                    break;
                        
                    default:
                    http_response_code(404);
                    echo "Invalid action: $action"; // Debugging output for invalid action
            }
        } else {
            http_response_code(405);
            header("Allow: POST");
            echo "Invalid method: $method"; // Debugging output for invalid 
        }
    }

    private function processLoginRequest(): void
    {

        $data = (array) json_decode(file_get_contents("php://input"), true);
        $errors = $this->getLogInValidationErrors(($data));

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(["errors" => $errors]);
        }

        $user = $this->gateway->login($data['email'], $data['password']);

        if (!$user) {
            http_response_code(401);
            echo json_encode(["message" => "Incorrect email/password"]);
            return;
        }

        echo json_encode($user);

    }

    private function processRegistrationRequest(): void
    {
        $data = (array) json_decode(file_get_contents("php://input"), true);
        echo "Registration data received: " . json_encode($data); // Debugging output

        $errors = $this->getRegistrationValidationErrors(($data));

        if (!empty($errors)) {
            http_response_code(422);
            echo "Validation errors: " . json_encode($errors); // Debugging output
            return;
        }

        $id = $this->gateway->register($data);
        echo "User registered with ID: $id"; // Debugging output

        http_response_code(201);
        echo json_encode([
            "message" => "User created",
            "id" => $id
        ]);
    }






    private function getLogInValidationErrors(array $data): array
    {
        $errors = [];
        if (empty($data["email"])) {
            $errors[] = "Email is required";
        }

        if (empty($data["password"])) {
            $errors[] = "Password is required";
        }

        return $errors;
    }

    private function getRegistrationValidationErrors(array $data): array
    {
        $errors = [];
        if (empty($data["email"])) {
            $errors[] = "Email is required";
        }

        if (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email format";
        }

        if (empty($data["password"])) {
            $errors[] = "Password is required";
        }

        if (empty($data["firstName"])) {
            $errors[] = "First name is required";
        }

        if (empty($data["lastName"])) {
            $errors[] = "Last name is required";
        }

        return $errors;
    }
}