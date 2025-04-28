# User Registration Endpoint

## POST /users/register

This endpoint is used to register a new user.

### Request Body

The request body should be a JSON object with the following properties:

- `fullname`: An object containing:
  - `firstname`: A string with at least 3 characters (required)
  - `lastname`: A string with at least 2 characters (optional)
- `email`: A string representing a valid email address (required)
- `password`: A string with at least 6 characters (required)

Example:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

- **200 OK**: User registered successfully.
  - Body:
    ```json
    {
      "token": "jwt_token",
      "user": {
        "_id": "user_id",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "body"
        }
      ]
    }
    ```

### Validation

The following validations are performed on the request body:

- `email` must be a valid email address.
- `fullname.firstname` must be at least 3 characters long.
- `password` must be at least 6 characters long.

# User Login Endpoint

## POST /users/login

This endpoint is used to log in an existing user.

### Request Body

The request body should be a JSON object with the following properties:

- `email`: A string representing a valid email address (required)
- `password`: A string with at least 6 characters (required)

Example:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

- **200 OK**: User logged in successfully.
  - Body:
    ```json
    {
      "token": "jwt_token",
      "user": {
        "_id": "user_id",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "body"
        }
      ]
    }
    ```

- **401 Unauthorized**: Invalid email or password.
  - Body:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

### Validation

The following validations are performed on the request body:

- `email` must be a valid email address.
- `password` must be at least 6 characters long.

# User Profile Endpoint

## GET /users/profile

This endpoint is used to get the profile of the logged-in user.

### Responses

- **200 OK**: User profile retrieved successfully.
  - Body:
    ```json
    {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
    ```

- **401 Unauthorized**: User not authenticated.
  - Body:
    ```json
    {
      "message": "Authentication required"
    }
    ```

# User Logout Endpoint

## GET /users/logout

This endpoint is used to log out the logged-in user.

### Responses

- **200 OK**: User logged out successfully.
  - Body:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **401 Unauthorized**: User not authenticated.
  - Body:
    ```json
    {
      "message": "Authentication required"
    }
    ```

# Captain Registration Endpoint

## POST /captains/register

This endpoint is used to register a new captain.

### Request Body

The request body should be a JSON object with the following properties:

- `fullname`: An object containing:
  - `firstname`: A string with at least 3 characters (required)
  - `lastname`: A string with at least 3 characters (required)
- `email`: A string representing a valid email address (required)
- `password`: A string with at least 6 characters (required)
- `vehicle`: An object containing:
  - `color`: A string with at least 3 characters (required)
  - `plate`: A string with at least 3 characters (required)
  - `capacity`: An integer with at least 1 (required)
  - `vehicleType`: A string that must be one of `car`, `bike`, or `auto` (required)

Example:
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

- **201 Created**: Captain registered successfully.
  - Body:
    ```json
    {
      "captain": {
        "_id": "captain_id",
        "fullname": {
          "firstname": "Jane",
          "lastname": "Doe"
        },
        "email": "jane.doe@example.com",
        "vehicle": {
          "color": "red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      },
      "token": "jwt_token"
    }
    ```

- **400 Bad Request**: Validation error or captain already exists.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "body"
        }
      ]
    }
    ```

### Validation

The following validations are performed on the request body:

- `fullname.firstname` must be at least 3 characters long.
- `fullname.lastname` must be at least 3 characters long.
- `email` must be a valid email address.
- `password` must be at least 6 characters long.
- `vehicle.color` must be at least 3 characters long.
- `vehicle.plate` must be at least 3 characters long.
- `vehicle.capacity` must be at least 1.
- `vehicle.vehicleType` must be one of `car`, `bike`, or `auto`.

# Captain Login Endpoint

## POST /captains/login

This endpoint is used to log in an existing captain.

### Request Body

The request body should be a JSON object with the following properties:

- `email`: A string representing a valid email address (required)
- `password`: A string with at least 6 characters (required)

Example:
```json
{
  "email": "jane.doe@example.com",
  "password": "password123"
}
```

### Responses

- **200 OK**: Captain logged in successfully.
  - Body:
    ```json
    {
      "token": "jwt_token",
      "captain": {
        "_id": "captain_id",
        "fullname": {
          "firstname": "Jane",
          "lastname": "Doe"
        },
        "email": "jane.doe@example.com",
        "vehicle": {
          "color": "red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      }
    }
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "body"
        }
      ]
    }
    ```

- **401 Unauthorized**: Invalid email or password.
  - Body:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

### Validation

The following validations are performed on the request body:

- `email` must be a valid email address.
- `password` must be at least 6 characters long.

# Captain Profile Endpoint

## GET /captains/profile

This endpoint is used to get the profile of the logged-in captain.

### Responses

- **200 OK**: Captain profile retrieved successfully.
  - Body:
    ```json
    {
      "captain": {
        "_id": "captain_id",
        "fullname": {
          "firstname": "Jane",
          "lastname": "Doe"
        },
        "email": "jane.doe@example.com",
        "vehicle": {
          "color": "red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      }
    }
    ```

- **401 Unauthorized**: Captain not authenticated.
  - Body:
    ```json
    {
      "message": "Authentication required"
    }
    ```

# Captain Logout Endpoint

## GET /captains/logout

This endpoint is used to log out the logged-in captain.

### Responses

- **200 OK**: Captain logged out successfully.
  - Body:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **401 Unauthorized**: Captain not authenticated.
  - Body:
    ```json
    {
      "message": "Authentication required"
    }
    ```

# Get Coordinates Endpoint

## GET /get-coordinates

This endpoint is used to get the coordinates (latitude and longitude) for a given address.

### Query Parameters

- `address`: A string representing the address to get coordinates for (required)

Example:
```
/get-coordinates?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA
```

### Responses

- **200 OK**: Coordinates retrieved successfully.
  - Body:
    ```json
    {
      "ltd": 37.4224764,
      "lng": -122.0842499
    }
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "query"
        }
      ]
    }
    ```

- **404 Not Found**: Coordinates not found.
  - Body:
    ```json
    {
      "message": "Coordinate not found"
    }
    ```

### Validation

The following validations are performed on the query parameters:

- `address` must be a string with at least 3 characters.

# Get Distance and Time Endpoint

## GET /get-distance-time

This endpoint is used to get the distance and time between two locations.

### Query Parameters

- `origin`: A string representing the starting location (required)
- `destination`: A string representing the ending location (required)

Example:
```
/get-distance-time?origin=New+York,+NY&destination=Los+Angeles,+CA
```

### Responses

- **200 OK**: Distance and time retrieved successfully.
  - Body:
    ```json
    {
      "distance": {
        "text": "2,789 mi",
        "value": 4488372
      },
      "duration": {
        "text": "1 day 18 hours",
        "value": 151200
      }
    }
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "query"
        }
      ]
    }
    ```

- **500 Internal Server Error**: Internal server error.
  - Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

### Validation

The following validations are performed on the query parameters:

- `origin` must be a string with at least 3 characters.
- `destination` must be a string with at least 3 characters.

# Get Autocomplete Suggestions Endpoint

## GET /get-suggestion

This endpoint is used to get autocomplete suggestions for a given input.

### Query Parameters

- `input`: A string representing the input to get suggestions for (required)

Example:
```
/get-suggestion?input=1600+Amphitheatre
```

### Responses

- **200 OK**: Suggestions retrieved successfully.
  - Body:
    ```json
    [
      {
        "description": "1600 Amphitheatre Parkway, Mountain View, CA, USA",
        "place_id": "ChIJ2eUgeAK6j4ARbn5u_wAGqWA"
      },
      // more suggestions...
    ]
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "query"
        }
      ]
    }
    ```

- **500 Internal Server Error**: Internal server error.
  - Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

### Validation

The following validations are performed on the query parameters:

- `input` must be a string with at least 3 characters.

# Create Ride Endpoint

## POST /create

This endpoint is used to create a new ride.

### Request Body

The request body should be a JSON object with the following properties:

- `pickup`: A string representing the pickup location (required)
- `destination`: A string representing the destination location (required)
- `vehicleType`: A string that must be one of `auto`, `car`, or `bike` (required)

Example:
```json
{
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "vehicleType": "car"
}
```

### Responses

- **200 OK**: Ride created successfully.
  - Body:
    ```json
    {
      "ride": {
        "_id": "ride_id",
        "user": "user_id",
        "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
        "destination": "1 Infinite Loop, Cupertino, CA",
        "fare": 50,
        "status": "pending",
        "otp": "123456"
      }
    }
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "body"
        }
      ]
    }
    ```

- **500 Internal Server Error**: Internal server error.
  - Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

### Validation

The following validations are performed on the request body:

- `pickup` must be a string with at least 3 characters.
- `destination` must be a string with at least 3 characters.
- `vehicleType` must be one of `auto`, `car`, or `bike`.

# Get Fare Endpoint

## GET /get-fare

This endpoint is used to calculate the fare for a ride based on the pickup and destination locations.

### Query Parameters

- `pickup`: A string representing the pickup location (required)
- `destination`: A string representing the destination location (required)

Example:
```
/get-fare?pickup=1600+Amphitheatre+Parkway,+Mountain+View,+CA&destination=1+Infinite+Loop,+Cupertino,+CA
```

### Responses

- **200 OK**: Fare calculated successfully.
  - Body:
    ```json
    {
      "auto": 50,
      "car": 75,
      "bike": 30
    }
    ```

- **400 Bad Request**: Validation error.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "query"
        }
      ]
    }
    ```

- **500 Internal Server Error**: Internal server error.
  - Body:
    ```json
    {
      "message": "Internal server error"
    }
    ```

### Validation

The following validations are performed on the query parameters:

- `pickup` must be a string with at least 3 characters.
- `destination` must be a string with at least 3 characters.