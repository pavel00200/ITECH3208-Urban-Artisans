# Urban Artisans — Backend

Express.js REST API with POSTGRESQL database.

## Setup

```bash
cd backend
npm install
node db/seed.js      # creates the database and inserts sample data
node server.js       # starts the server on port 4000
```

## API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| POST   | /login               | Login with email + password        |
| GET    | /products            | Get all products                   |
| GET    | /products/:slug      | Get single product by slug         |
| POST   | /orders              | Place a new order                  |
| GET    | /orders/:userId      | Get all orders for a user          |
| GET    | /artisans            | Get all artisans                   |
| GET    | /artisans/:id        | Get artisan with their products    |


## Demo Account

- Email: `test@gmail.com`
- Password: `123456`