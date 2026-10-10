Travel Bingo — Airbnb-Style Listing Application

A full-stack Airbnb-style listing and booking application built with Node.js, Express, MongoDB, Vue.js, and Cloudinary.

Travel Bingo allows users to create and manage property listings, upload images, leave reviews, and make date-based bookings. The application includes session-based authentication, resource-level authorization, booking availability checks, cancellation handling, and a responsive Vue.js frontend.

The application has been manually end-to-end tested across its major user flows.

Features

Authentication & Sessions

- User signup, login, and logout
- Username and password authentication using Passport.js
- Session-based authentication with Express Session
- MongoDB-backed session storage using Connect-Mongo
- Email verification during login
- Email uniqueness validation during signup
- Client-side UX validation and server-side user validation

Listings

- Create, view, edit, and delete listings
- Upload listing images through Cloudinary
- Replace images when updating a listing
- Listing ownership authorization
- Protected listing routes

Reviews

- Create, display, and delete reviews
- Review ownership authorization
- Automatically remove associated reviews when a listing is deleted

Booking Management

- Date-based check-in and check-out
- Guest count support
- Automatic price calculation based on listing price and booking duration
- Availability checks and date-overlap detection
- Booking creation, viewing, and cancellation
- Seven-day cancellation policy
- Cancelled bookings remain stored with a `CANCELLED` status
- Cancelled bookings no longer block listing availability
- Active booking queries return only `CONFIRMED` bookings
- Booking authorization to prevent unauthorized access to other users' bookings

Validation & Error Handling

- Client-side UX validation
- Server-side request validation using Joi
- Authentication middleware for protected routes
- Listing, review, and booking authorization
- Centralized Express error handling

Image Management

- Multer handles incoming image uploads
- Cloudinary stores listing images
- MongoDB stores each image's secure URL and public ID
- Old Cloudinary images are cleaned up when replaced or when their listing is deleted

Tech Stack

| Area                | Technologies                         |
| ------------------- | ------------------------------------ |
| Backend             | Node.js, Express.js                  |
| Database            | MongoDB, Mongoose                    |
| Authentication      | Passport.js, Passport Local Mongoose |
| Sessions            | Express Session, Connect-Mongo       |
| Validation          | Joi                                  |
| Image uploads       | Multer, Cloudinary                   |
| Frontend            | Vue.js, Vue Router                   |
| Build tool          | Vite                                 |
| Languages & styling | JavaScript, HTML, CSS                |

Architecture

The application uses a Vue.js frontend with Vue Router for client-side navigation and an Express backend for server-side operations.

- Frontend: Renders the user interface and handles client-side navigation.
- Backend: Handles authentication, sessions, API requests, validation, authorization, listings, reviews, and bookings.
- Database: MongoDB stores users, listings, reviews, bookings, and session data.
- Image storage: Cloudinary stores listing images, while MongoDB stores image metadata.

The frontend communicates with the backend using asynchronous `fetch()` requests.

Testing

The application has been manually end-to-end tested across its major user flows, including authentication, listing management, reviews, booking availability, and cancellation handling.

Author

Shanmugam
