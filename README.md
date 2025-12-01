Tech Stack

Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication

Install dependencies:
    npm install

.env backend

    PORT=8080
    MONGO_URI=mongodb+srv://dhruvmak1144_db_user:JxzVvqkBWOOL0Bdu@cluster0.ng7swjw.mongodb.net/?appName=Cluster0

    JWT_ACCESS_SECRET=15490257614df5cbc86990186322d06b49efa0ef3164673fe209a0088680a4e5b53ffa326e939169570a008d25e6c57cf37ed3224310e1b34107ef35d352473b
    JWT_REFRESH_EXPIRES=7d

.env frontend

    VITE_API_URL:"http://localhost:8080/api"

Start server
    npm run dev

API Configuration
    Authorization: Bearer <refresh_token>

Roles 
    Admin → can add, edit, delete books
    User → can borrow and return books

Auth Routes
    POST api/auth/signup
    POST api/auth/login

Book Routes
    POST api/book/add-book
    PUT api/book/update/:id
    DELETE api/book/delete/:id
    GET api/book/all-books
    GET api/book/get-book/:id

Borrowing System
    POST api/borrow/borrow-book/:id
    POST api/borrow/return-book/:id



Challenges I faced:-

    1. Time management:-
        The biggest challenge during this project was managing time while completing all backend and frontend requirements.

    2. Confusion About Schema Count:-
        I was confused about how many schemas the project really needed.I wasn’t sure if I should create separate schemas for genres or borrowing, or keep everything inside the book model.

        After understanding the requirements, i came to the decision as 3 schemas would be better at here:
            User Schema
            Book Schema
            Borrow Schema
