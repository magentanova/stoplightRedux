#User Authentication

##to register:
###request
  - Send an POST request to `/auth/register`
  - Set the content type to JSON
  - Include in the request body a JSON object containing all the data you wish to save about your user
  - *required fields*: "email" and "password"
  - *optional fields*: currently just "name", but ask the back-end lead once those tasks are underway

###response
  - JSON representing the newly saved user, now with `_id` and `createdAt` fields OR
  - an error message

##to log in:
###request
  - Send a POST request to `/auth/login`
  - Set the content type to JSON
  - Include in the request body a JSON object with the fields "email" and "password"

###response
  - JSON representing the newly logged-in user OR
  - an error message

##to log out:
###request
  - Send a GET request to `/auth/logout`

###response
  - JSON containing a message confirming logout OR
  - an error message

##user sessions
  - Sessions are maintained server-side
  - Every response from the server will always contain a cookie with the key `ironPong_user`
  - The value will be `null` if there is no current user session; otherwise the value will be the current user as a JSON object