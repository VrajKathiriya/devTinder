# devTinder APIs

POST /signup
POST /login
POST /logout

GET /profile
PATCH /profile/edit
PATH /profile/password

POST /request/interested/:userId
POST /request/ignored/:userId

POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

GET /connections
GET /requests/received
GET /feed -- Gets you the profiles of other users
