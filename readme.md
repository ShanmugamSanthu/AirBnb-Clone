Travel Bingo — Airbnb-Style Listing Application

**Live Demo:** https://travel-bingo-2b3l.onrender.com

A full-stack Airbnb-style listing and booking application built with Node.js, Express, MongoDB, Vue.js, and Cloudinary.

Travel Bingo allows users to create and manage property listings, upload images, leave reviews, and make date-based bookings. The application includes session-based authentication, resource-level authorization, booking availability checks, cancellation handling, and a responsive Vue.js frontend.

The application has been manually end-to-end tested across its major user flows.

Features

Authentication & Sessions# Travel Bingo — Full-Stack Listing & Booking Application

Travel Bingo is a full-stack Airbnb-style application where users can discover places to stay, create and manage property listings, write reviews, and make date-based bookings.

Built with **Vue 3, Vite, Node.js, Express, MongoDB, and Mongoose**, the application includes session-based authentication, resource-level authorization, image uploads, review management, and booking availability validation.

## Features

### Authentication & Authorization

- User registration, login, and logout.
- Passport Local authentication with session persistence.
- MongoDB-backed session storage in the deployed configuration.
- Email verification during login and email uniqueness validation during registration.
- Protected routes and resource-level authorization.

### Listing Management

- Create, view, edit, and delete property listings.
- Navigate to listing details by clicking the listing image or title.
- Upload and replace listing images using Cloudinary.
- Restrict listing modifications to the listing owner.
- Automatically remove associated reviews and bookings when a listing is deleted.

### Reviews & Ratings

- Add reviews with star ratings.
- Display reviews associated with individual listings.
- Restrict review deletion to authorized users.
- Automatically remove reviews when their associated listing is deleted.

### Booking Management

- Create bookings with check-in and check-out dates.
- Specify guest counts and calculate prices based on listing price and booking duration.
- Validate booking availability and detect overlapping date ranges.
- Cancel bookings subject to the application's cancellation policy.
- Preserve normally cancelled bookings with a `CANCELLED` status.
- Exclude cancelled bookings from availability checks.
- Restrict access to bookings according to authorization rules.
- Delete associated bookings when a listing is permanently deleted.

### Validation & Error Handling

- Client-side validation for a better user experience.
- Server-side request validation using Joi.
- Authentication and authorization middleware.
- Centralized Express error handling.

### Image Management

- Handle multipart uploads with Multer.
- Store listing images in Cloudinary.
- Save image URLs and public IDs in MongoDB.
- Clean up replaced or deleted listing images in Cloudinary.

## Tech Stack

| Area           | Technologies                         |
| -------------- | ------------------------------------ |
| Frontend       | Vue 3, Vue Router                    |
| Build Tool     | Vite                                 |
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB, Mongoose                    |
| Authentication | Passport.js, Passport Local Mongoose |
| Sessions       | Express Session, Connect-Mongo       |
| Validation     | Joi                                  |
| Image Uploads  | Multer, Cloudinary                   |
| Requests       | Fetch API                            |
| Languages      | JavaScript, HTML, CSS                |

## Application Architecture

The application separates frontend rendering from backend operations.

- **Frontend:** Vue components render the interface, Vue Router handles client-side navigation, and Fetch API requests communicate with the backend.
- **Backend:** Express handles authentication, session management, CRUD operations, validation, authorization, reviews, and bookings.
- **Database:** MongoDB stores users, listings, reviews, bookings, and session data.
- **Image Storage:** Cloudinary stores listing images while MongoDB stores their associated metadata.

## Deployment

The application is deployed on Render, with the frontend and backend configured for production.

Production configuration includes the frontend API URL, backend CORS origin, session cookies, database connection, and Cloudinary credentials.

Set environment variables through the deployment platform's configuration rather than committing secrets to the repository.

## Testing

The application's major user flows have been manually tested in development and production, including:

- Registration, login, logout, and session persistence.
- Listing creation, editing, viewing, and deletion.
- Review creation and star-rating interaction.
- Booking creation, date-overlap validation, and cancellation.
- Authorization checks and related-record cleanup when listings are deleted.

Automated tests are not currently configured.

## Author

**Shanmugam**

_Travel Bingo is a personal full-stack development project built to practice and demonstrate frontend development, backend APIs, authentication, database relationships, validation, and production deployment._
