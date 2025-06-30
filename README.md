# ByteChat - Messaging App
A full-stack messaging web application where users can sign up and exchange messages with other users. This project is built as part of [The Odin Project's](https://www.theodinproject.com/lessons/nodejs-messaging-app) NodeJS curriculum.

**Live Demo** : 
https://bytechat-app.netlify.app/ (The site may take 2-3 mins to load for the first time. Since the server is deployed on the free tier plan, the server goes to sleep state if it doesn't receive any API calls for 15 minutes)

## **Features**

* **User Authentication**: Secure user registration and login system.

* **One-to-One Messaging**: Users can find and send direct messages to other registered users.

## **Tech Stack**

* **Frontend**

    * **React**: JavaScript library for building user interfaces.

    * **React Router**: For client-side routing.

* **Backend**

    * **Node.js**: JavaScript runtime environment.

    * **Express.js**: Web framework for Node.js.

    * **PostgreSQL**: SQL database for storing user data, messages, and profiles.

    * **Prisma**: ORM for PostgreSQL and Node.js.

    * **Passport.js**: Authentication middleware for Node.js.

    * **JSON Web Tokens (JWT)**: For securing API endpoints.


## API Endpoints

A brief overview of the main API routes available in the backend.

 **Authentication**

* `POST /auth/register`: Register a new user.

* `POST /auth/login`: Log in an existing user.

* `POST /auth/logout`: Log out the current user.

* `GET /auth/verify-token`: Verify the user's token and get user data.

**Chats & Messages**

* `GET /api/chats`: Get all chats for the logged-in user.

* `POST /api/chats/new`: Create a new chat with another user.

* `DELETE /api/chats`: Delete a specific chat.

* `POST /api/chat`: Send a message to a specific chat.
