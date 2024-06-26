# API Documentation

## User Routes

### Register User
- **URL:** `/api/users/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  - `name`: String (required) - User's name.
  - `email`: String (required) - User's email.
  - `password`: String (required) - User's password.
  - `role`: String (required) - User's role (user/superadmin).
- **Response:**
  - `token`: String - JWT token for authentication.

### Get Profile
- **URL:** `/api/users/profile`
- **Method:** `GET`
- **Description:** Retrieves the user's profile.
- **Authorization:** Required
- **Response:**
  - `user`: Object - User profile data.

### Update Profile
- **URL:** `/api/users/profile`
- **Method:** `PUT`
- **Description:** Updates the user's profile.
- **Authorization:** Required
- **Request Body:**
  - `name`: String - Updated name.
  - `email`: String - Updated email.
  - `profile_picture`: String - Updated profile picture URL.
- **Response:**
  - `message`: String - Success message.
  - `user`: Object - Updated user profile data.

## Course Routes

### Get Courses
- **URL:** `/api/courses`
- **Method:** `GET`
- **Description:** Retrieves a list of courses.
- **Query Parameters:**
  - `popularity`: Number - Minimum popularity.
  - `level`: String - Course level.
  - `category`: String - Course category.
  - `page`: Number (default: 1) - Page number for pagination.
  - `limit`: Number (default: 10) - Limit of courses per page.
- **Response:**
  - `courses`: Array - List of courses.
  - `totalCount`: Number - Total count of courses.

### Enroll User
- **URL:** `/api/enrollments`
- **Method:** `POST`
- **Description:** Enrolls a user in a course.
- **Authorization:** Required
- **Request Body:**
  - `courseId`: String (required) - ID of the course to enroll in.
- **Response:**
  - `message`: String - Success message.
  - `enrollment`: Object - Enrolled course data.

### Get Enrolled Courses
- **URL:** `/api/enrollments/:user_id`
- **Method:** `GET`
- **Description:** Retrieves the enrolled courses of a user.
- **Authorization:** Required
- **Response:**
  - `enrollments`: Array - List of enrolled courses.

