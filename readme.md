Airbnb-Style Listing Application

A full-stack Airbnb-style listing application built with Node.js, Express, MongoDB, Mongoose, EJS, Passport.js, and Cloudinary.

The current version focuses on building and stabilizing the backend, database integration, authentication, authorization, validation, image uploads, listings, and reviews.

The frontend is currently built with EJS and will be modernized gradually with Vue.js.

Tech Stack

Backend

Node.js
Express.js
MongoDB
Mongoose
Passport
Passport Local Mongoose
Express Session
Connect-Mongo
Joi
Multer
Cloudinary

Frontend

EJS
JavaScript
CSS

Current Features

User Authentication

User signup
User login
User logout
Session-based authentication
MongoDB-backed sessions
Username and password authentication through Passport
Email verification during login
Email uniqueness check during signup
Server-side user validation

Listings

Create listings
View listings
Edit listings
Delete listings
Image upload through Cloudinary
Replace listing images during updates
Listing ownership authorization

Reviews

Create reviews
Display reviews
Delete reviews
Review ownership authorization
Reviews are removed when their associated listing is deleted

Validation & Authorization

Joi server-side validation
Authentication middleware for protected routes
Listing ownership checks
Review ownership checks
Users cannot modify or delete resources belonging to another user

Image Handling

Listing images are uploaded using Multer and stored on Cloudinary.

The MongoDB listing document stores:

Cloudinary secure URL
Cloudinary public ID
Airbnb-Style Listing Application

A full-stack Airbnb-style listing application built with Node.js, Express, MongoDB, Mongoose, Passport.js, Vue.js, and Cloudinary.

The current version focuses on building and stabilizing the backend, database integration, authentication, authorization, validation, image uploads, listings, reviews, and a Vue.js frontend.

The application has been manually end-to-end tested across its major user flows.

Tech Stack

Backend

Node.js
Express.js
MongoDB
Mongoose
Passport.js
Passport Local Mongoose
Express Session
Connect-Mongo
Joi
Multer
Cloudinary

Frontend

Vue.js
Vue Router
JavaScript
Vite
HTML
CSS

User Authentication

User signup
User login
User logout
Session-based authentication
MongoDB-backed sessions
Username and password authentication through Passport
Email verification during login
Email uniqueness check during signup
Client-side UX validation
Server-side user validation

Listings

Create listings
View listings
Edit listings
Delete listings
Image upload through Cloudinary
Replace listing images during updates
Listing ownership authorization
Protected listing routes

Reviews

Create reviews
Display reviews
Delete reviews
Review ownership authorization
Reviews are automatically removed when their associated listing is deleted

Validation & Authorization

Client-side UX validation
Joi server-side validation
Authentication middleware for protected routes
Listing ownership checks
Review ownership checks
Users cannot modify or delete resources belonging to another user
Centralized Express error handling

Image Handling

Listing images are uploaded using Multer and stored on Cloudinary.

The MongoDB listing document stores:

Cloudinary secure URL
Cloudinary public ID

Cloudinary images are also cleaned up when their associated listing image is replaced or the listing is deleted.

Frontend Architecture

Vue Router is used for client-side navigation, while the existing Express backend continues to handle API-style requests, authentication, database operations, validation, and authorization.

The frontend communicates with the backend using fetch() for asynchronous operations.
