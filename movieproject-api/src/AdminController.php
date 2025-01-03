<?php
class AdminController
{
    public function __construct(private AdminGateway $gateway)
    {
    }

    public function processRequest(string $method, string $action): void
    {
        if ($method === 'POST') {
            switch ($action) {
                case "login":
                    $this->processLoginRequest();
                    break;

                case "register":
                    $this->processRegistrationRequest();
                    break;
            }
        } else {
            http_response_code(405);
            header("Allow: POST");
        }
    }

    private function processLoginRequest(): void
    {
        $data = (array) json_decode(file_get_contents("php://input"), true);
        $errors = $this->getLogInValidationErrors($data);

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(["errors" => $errors]);
            return;
        }

        $user = $this->gateway->login($data['email'], $data['password']);

        if (!$user) {
            http_response_code(401);
            echo json_encode(["message" => "Incorrect email/password"]);
            return;
        }

        // Generate a JWT token for the user
        $token = $this->generateJwtToken($user);

        // Respond with the token and user data
        echo json_encode([
            'access_token' => $token,
            'user' => $user
        ]);
    }

// Function to generate the JWT token
private function generateJwtToken($user): string
{
    // You may need to adjust this based on your JWTCodec implementation
    return $this->codec->encode([
        'userId' => $user['userId'],
        'email' => $user['email'],
        'role' => $user['role'],
        // Add more user fields to the payload as needed
    ]);
}

    private function processRegistrationRequest(): void
    {

        $data = (array) json_decode(file_get_contents("php://input"), true);
        $errors = $this->getRegistrationValidationErrors(($data));

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(["errors" => $errors]);
        } else {
            $id = $this->gateway->register($data); 
            http_response_code(201);
            echo json_encode([
                "message" => "User created",
                "id" => $id
            ]);
        }

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