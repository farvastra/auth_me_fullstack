
# AUTH ME BACKEND`

## Database Schema Design

`<insert database schema design here>`

## users table

CREATE TABLE Users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
first_name TEXT NOT NULL,
last_name TEXT NOT NULL,
username TEXT NOT NULL UNIQUE,
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Spots Table

CREATE TABLE Spots (
id INTEGER PRIMARY KEY AUTOINCREMENT,
owner_id INTEGER NOT NULL,
name TEXT NOT NULL,
description TEXT NOT NULL,
price DECIMAL(10, 2) NOT NULL,
address TEXT NOT NULL,
city TEXT,
state TEXT,
country TEXT,
lat FLOAT,
lng FLOAT,
avg_rating FLOAT DEFAULT 0.0,
preview_image TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);

## Reviews Table

CREATE TABLE Reviews (
id INTEGER PRIMARY KEY AUTOINCREMENT,
spot_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
stars INTEGER CHECK(rating >= 1 AND rating <= 5),
review TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (spot_id) REFERENCES Spots(id) ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

## bookings table

CREATE TABLE Bookings (
id INTEGER PRIMARY KEY AUTOINCREMENT,
spot_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (spot_id) REFERENCES Spots(id) ON DELETE CASCADE,
FOREIGN KEY (user_id)
)

## API Documentation

BASE URL-
`https://auth-me-backend.onrender.com/api` or `https://auth-me-backend.onrender.com`

- Endpoint: POST /users
- Body:

  ```json
  {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith"
    }
  }
  ```

Endpoint: POST /spots

- Body:

      ```json{

  "ownerId": 1,
  "name": "Beach House",
  "description": "A beautiful beach house.",
  "price": 250.00,
  "address": "123 Beach St",
  "city": "Ocean City",
  "state": "CA",
  "country": "USA",
  "lat": 34.0522,
  "lng": -118.2437,
  "previewImage": "http://example.com/image.jpg"
  }

- Endpoint: GET /spots
- response:

      ```json
        "Spots": [

  {
  "id": 1,
  "ownerId": 1,
  "name": "Beach House",
  "description": "A beautiful beach hous\* Body:e.",
  "price": 250.00,
  "address": "123 Beach St",
  "city": "Ocean City",
  "state": "CA",
  "country": "USA",
  "lat": 34.0522,
  "lng": -118.2437,
  "avgRating": 0.0,
  "previewImage": "http://example.com/image.jpg"
  }
  ]

- Endpoint: POST /bookings

```json
{
  "userId": 1,
  "spotId": 1,
  "startDate": "2024-10-12",
  "endDate": "2024-10-15"
}
```

- Endpoint: GET /bookings

      ```json

  "Bookings": [
  {
  "id": 1,
  "userId": 1,
  "spotId": 1,
  "startDate": "2024-10-12",
  "endDate": "2024-10-15"
  }
  ]

- Endpoint: POST /reviews

```json
{
  "userId": 1,
  "spotId": 1,
  "rating": 5,
  "comment": "Amazing stay!"
}
```

- Endpoint: POST /spotImages

```json
{
  "spotId": 1,
  "url": "http://example.com/image.jpg"
}
```
