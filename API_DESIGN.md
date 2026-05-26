# API_DESIGN.md

# Authentication APIs

## signup

Function Name:
signup

Purpose:
Register a new account and create the initial user profile and role mapping.

HTTP Method:
POST

Route:
/api/auth/signup

Access Role:
Public

Request Body:
```json
{
  "name": "",
  "email": "",
  "password": "",
  "role": "USER"
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "userId": "",
  "role": "USER",
  "message": "Signup successful"
}
```

Error Responses:
400 Validation error
409 Email already exists
500 Server error

Notes:
Default role should be USER unless ADMIN-controlled onboarding allows RESOLVER creation. Password is never returned.

Related Collections:
users
user_profiles
roles
user_role_mappers
spark_transactions
notifications

Future Swagger Tag:
Authentication

---

## login

Function Name:
login

Purpose:
Authenticate a user and issue a JWT in an HTTP-only cookie.
NOTE : We might need some sessions storage.

HTTP Method:
POST

Route:
/api/auth/login

Access Role:
Public

Request Body:
```json
{
  "email": "",
  "password": ""
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "roles": ["USER"]
  }
}
```

Error Responses:
400 Validation error
401 Invalid credentials
403 Account disabled
500 Server error

Notes:
JWT should be set using a secure HTTP-only cookie. Response should not expose password hash.

Related Collections:
users
roles
user_role_mappers

Future Swagger Tag:
Authentication

---

## logout

Function Name:
logout

Purpose:
Clear the authentication cookie.

HTTP Method:
POST

Route:
/api/auth/logout

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

Error Responses:
401 Unauthorized
500 Server error

Notes:
The server should clear the JWT cookie using the same cookie name and compatible cookie options.

Related Collections:
users

Future Swagger Tag:
Authentication

---


Related Collections:
users
user_profiles
roles
user_role_mappers

Future Swagger Tag:
Authentication

---

# User APIs

## listUsers

Function Name:
listUsers

Purpose:
List users with filtering for admin and moderation views.

HTTP Method:
GET

Route:
/api/users

Access Role:
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "role": "USER",
  "status": "active",
  "search": ""
}
```

Success Response:
```json
{
  "success": true,
  "users": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
403 Forbidden
500 Server error

Notes:
Should support role-based filtering through role mapper lookup.

Related Collections:
users
user_profiles
roles
user_role_mappers

Future Swagger Tag:
Users

---

## getUserById

Function Name:
getUserById

Purpose:
Get public user information and profile details.

HTTP Method:
GET

Route:
/api/users/:userId

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
```json
{
  "userId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "user": {
    "id": "",
    "name": "",
    "roles": ["USER"],
    "profile": {},
    "stats": {
      "questionsCount": 0,
      "answersCount": 0,
      "acceptedAnswersCount": 0
    }
  }
}
```

Error Responses:
401 Unauthorized
404 User not found
500 Server error

Notes:
Private fields such as password hash, internal flags, and email visibility should be controlled by role and ownership.

Related Collections:
users
user_profiles
roles
user_role_mappers
questions
answers

Future Swagger Tag:
Users

---

## updateUserStatus

Function Name:
updateUserStatus

Purpose:
Enable, disable, suspend, or reactivate a user account.

HTTP Method:
PATCH

Route:
/api/users/:userId/status

Access Role:
ADMIN

Request Body:
```json
{
  "status": "active",
  "reason": ""
}
```

Path Params:
```json
{
  "userId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "User status updated"
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 User not found
500 Server error

Notes:
Use for administrative account control. Consider notification on suspension or reactivation.

Related Collections:
users
notifications

Future Swagger Tag:
Admin

---

# User Profile APIs

## getMyProfile

Function Name:
getMyProfile

Purpose:
Fetch the authenticated user's full profile.

HTTP Method:
GET

Route:
/api/profile/me

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "profile": {
    "userId": "",
    "displayName": "",
    "bio": "",
    "avatarUrl": "",
    "expertise": [],
    "sparkBalance": 0,
    "reputation": 0
  }
}
```

Error Responses:
401 Unauthorized
404 Profile not found
500 Server error

Notes:
Profile is created during signup but should be recoverable if missing.

Related Collections:
user_profiles
users

Future Swagger Tag:
Users

---

## updateMyProfile

Function Name:
updateMyProfile

Purpose:
Update authenticated user's editable profile fields.

HTTP Method:
PATCH

Route:
/api/profile/me

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "displayName": "",
  "bio": "",
  "avatarUrl": "",
  "expertise": [],
  "location": "",
  "socialLinks": {}
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "profile": {}
}
```

Error Responses:
400 Validation error
401 Unauthorized
500 Server error

Notes:
Only editable profile fields should be accepted. Spark and reputation fields must not be client-controlled.

Related Collections:
user_profiles

Future Swagger Tag:
Users

---

## getPublicProfile

Function Name:
getPublicProfile

Purpose:
Fetch a public profile for question, answer, and leaderboard displays.

HTTP Method:
GET

Route:
/api/profile/:userId

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
```json
{
  "userId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "profile": {
    "userId": "",
    "displayName": "",
    "avatarUrl": "",
    "bio": "",
    "expertise": [],
    "reputation": 0
  }
}
```

Error Responses:
401 Unauthorized
404 Profile not found
500 Server error

Notes:
Do not expose private settings, email, or internal moderation state.

Related Collections:
user_profiles
users
answers
questions

Future Swagger Tag:
Users

---

# Question APIs

## createQuestion

Function Name:
createQuestion

Purpose:
Create a new question.

HTTP Method:
POST

Route:
/api/questions

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "title": "",
  "body": "",
  "category": "",
  "tags": [],
  "sparkBounty": 0
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "questionId": "",
  "message": "Question created"
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Insufficient spark balance
500 Server error

Notes:
If spark bounty is provided, create a spark transaction and reserve or debit the user's spark balance according to product rules.

Related Collections:
questions
spark_transactions
notifications
user_profiles

Future Swagger Tag:
Questions

---

## listQuestions

Function Name:
listQuestions

Purpose:
List questions for feed, category pages, and admin review.

HTTP Method:
GET

Route:
/api/questions

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "category": "",
  "tag": "",
  "status": "open",
  "sort": "newest",
  "search": ""
}
```

Success Response:
```json
{
  "success": true,
  "questions": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
500 Server error

Notes:
Default user feed should hide deleted or rejected questions. Admin views may include moderation statuses.

Related Collections:
questions
answers
comments
flags
user_profiles

Future Swagger Tag:
Questions

---

## getQuestionById

Function Name:
getQuestionById

Purpose:
Fetch a question with answer and comment summary.

HTTP Method:
GET

Route:
/api/questions/:questionId

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
```json
{
  "questionId": ""
}
```

Query Params:
```json
{
  "includeAnswers": true,
  "includeComments": true
}
```

Success Response:
```json
{
  "success": true,
  "question": {},
  "answers": [],
  "comments": []
}
```

Error Responses:
401 Unauthorized
404 Question not found
500 Server error

Notes:
May increment view count if supported by the questions collection.

Related Collections:
questions
answers
comments
user_profiles

Future Swagger Tag:
Questions

---

## updateQuestion

Function Name:
updateQuestion

Purpose:
Edit an existing question owned by the authenticated user or managed by admin.

HTTP Method:
PATCH

Route:
/api/questions/:questionId

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "title": "",
  "body": "",
  "category": "",
  "tags": []
}
```

Path Params:
```json
{
  "questionId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "question": {}
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 Question not found
409 Question locked or resolved
500 Server error

Notes:
Only owner or ADMIN can edit. Editing may be restricted after accepted answer.

Related Collections:
questions
notifications

Future Swagger Tag:
Questions

---

## deleteQuestion

Function Name:
deleteQuestion

Purpose:
Soft delete a question.

HTTP Method:
DELETE

Route:
/api/questions/:questionId

Access Role:
USER
ADMIN

Request Body:
```json
{
  "reason": ""
}
```

Path Params:
```json
{
  "questionId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Question deleted"
}
```

Error Responses:
401 Unauthorized
403 Forbidden
404 Question not found
409 Question cannot be deleted
500 Server error

Notes:
Prefer soft delete to preserve answer, comment, flag, and transaction history.

Related Collections:
questions
answers
comments
flags
notifications

Future Swagger Tag:
Questions

---

## acceptAnswer

Function Name:
acceptAnswer

Purpose:
Mark an answer as accepted for a question.

HTTP Method:
POST

Route:
/api/questions/:questionId/accept-answer/:answerId

Access Role:
USER
ADMIN

Request Body:
None

Path Params:
```json
{
  "questionId": "",
  "answerId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Answer accepted"
}
```

Error Responses:
401 Unauthorized
403 Forbidden
404 Question or answer not found
409 Answer already accepted
500 Server error

Notes:
Question owner accepts answer. Award spark bounty or reputation to answer author when applicable.

Related Collections:
questions
answers
spark_transactions
notifications
user_profiles

Future Swagger Tag:
Questions

---

# Answer APIs

## createAnswer

Function Name:
createAnswer

Purpose:
Post an answer to a question.

HTTP Method:
POST

Route:
/api/questions/:questionId/answers

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "body": ""
}
```

Path Params:
```json
{
  "questionId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "answerId": "",
  "message": "Answer created"
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 Question not found
409 Question closed
500 Server error

Notes:
Notify question owner when a new answer is posted.

Related Collections:
answers
questions
notifications
user_profiles

Future Swagger Tag:
Answers

---

## updateAnswer

Function Name:
updateAnswer

Purpose:
Edit an existing answer.

HTTP Method:
PATCH

Route:
/api/answers/:answerId

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "body": ""
}
```

Path Params:
```json
{
  "answerId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "answer": {}
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 Answer not found
409 Answer locked
500 Server error

Notes:
Only answer owner or ADMIN can edit. Accepted answers may require edit history or lock rules.

Related Collections:
answers
questions
notifications

Future Swagger Tag:
Answers

---

## deleteAnswer

Function Name:
deleteAnswer

Purpose:
Soft delete an answer.

HTTP Method:
DELETE

Route:
/api/answers/:answerId

Access Role:
USER
ADMIN

Request Body:
```json
{
  "reason": ""
}
```

Path Params:
```json
{
  "answerId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Answer deleted"
}
```

Error Responses:
401 Unauthorized
403 Forbidden
404 Answer not found
409 Accepted answer cannot be deleted by user
500 Server error

Notes:
Admins may delete any answer. Users may be blocked from deleting accepted answers.

Related Collections:
answers
questions
comments
flags
notifications

Future Swagger Tag:
Answers

---

## voteAnswer

Function Name:
voteAnswer

Purpose:
Vote on answer quality.

HTTP Method:
POST

Route:
/api/answers/:answerId/vote

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "vote": "up"
}
```

Path Params:
```json
{
  "answerId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "score": 0
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Cannot vote own answer
404 Answer not found
409 Duplicate vote
500 Server error

Notes:
If no vote collection exists, this should be deferred or modeled inside answers with care.

Related Collections:
answers
user_profiles
spark_transactions
notifications

Future Swagger Tag:
Answers

---

# Comment APIs

## createComment

Function Name:
createComment

Purpose:
Add a comment to a question or answer.

HTTP Method:
POST

Route:
/api/comments

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "targetType": "question",
  "targetId": "",
  "body": ""
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "commentId": "",
  "message": "Comment created"
}
```

Error Responses:
400 Validation error
401 Unauthorized
404 Target not found
409 Target locked
500 Server error

Notes:
targetType should be restricted to question or answer unless future commentable entities are introduced.

Related Collections:
comments
questions
answers
notifications

Future Swagger Tag:
Comments

---

## listComments

Function Name:
listComments

Purpose:
List comments for a question or answer.

HTTP Method:
GET

Route:
/api/comments

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "targetType": "question",
  "targetId": "",
  "page": 1,
  "limit": 20
}
```

Success Response:
```json
{
  "success": true,
  "comments": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
400 Validation error
401 Unauthorized
404 Target not found
500 Server error

Notes:
Deleted or hidden comments should be excluded from normal user responses.

Related Collections:
comments
questions
answers
user_profiles

Future Swagger Tag:
Comments

---

## updateComment

Function Name:
updateComment

Purpose:
Edit a comment.

HTTP Method:
PATCH

Route:
/api/comments/:commentId

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "body": ""
}
```

Path Params:
```json
{
  "commentId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "comment": {}
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 Comment not found
500 Server error

Notes:
Only owner or ADMIN can edit.

Related Collections:
comments

Future Swagger Tag:
Comments

---

## deleteComment

Function Name:
deleteComment

Purpose:
Soft delete a comment.

HTTP Method:
DELETE

Route:
/api/comments/:commentId

Access Role:
USER
ADMIN

Request Body:
```json
{
  "reason": ""
}
```

Path Params:
```json
{
  "commentId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Comment deleted"
}
```

Error Responses:
401 Unauthorized
403 Forbidden
404 Comment not found
500 Server error

Notes:
Soft delete preserves moderation and notification history.

Related Collections:
comments
flags
notifications

Future Swagger Tag:
Comments

---

# Flag APIs

## createFlag

Function Name:
createFlag

Purpose:
Report inappropriate or incorrect content.

HTTP Method:
POST

Route:
/api/flags

Access Role:
USER
RESOLVER
ADMIN

Request Body:
```json
{
  "targetType": "question",
  "targetId": "",
  "reason": "",
  "description": ""
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "flagId": "",
  "message": "Flag submitted"
}
```

Error Responses:
400 Validation error
401 Unauthorized
404 Target not found
409 Duplicate flag
500 Server error

Notes:
targetType should support question, answer, and comment.

Related Collections:
flags
questions
answers
comments
notifications

Future Swagger Tag:
Flags

---

## listFlags

Function Name:
listFlags

Purpose:
List moderation flags for review.

HTTP Method:
GET

Route:
/api/flags

Access Role:
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "status": "pending",
  "targetType": "question",
  "reason": ""
}
```

Success Response:
```json
{
  "success": true,
  "flags": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
403 Forbidden
500 Server error

Notes:
Admin moderation queue should include enough target summary for review without requiring multiple frontend round trips.

Related Collections:
flags
questions
answers
comments
users
user_profiles

Future Swagger Tag:
Flags

---

## resolveFlag

Function Name:
resolveFlag

Purpose:
Resolve or dismiss a content flag.

HTTP Method:
PATCH

Route:
/api/flags/:flagId/resolve

Access Role:
ADMIN

Request Body:
```json
{
  "status": "resolved",
  "action": "hide_content",
  "resolutionNote": ""
}
```

Path Params:
```json
{
  "flagId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Flag resolved"
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 Flag not found
409 Flag already resolved
500 Server error

Notes:
Action may include no_action, hide_content, delete_content, warn_user, or suspend_user.

Related Collections:
flags
questions
answers
comments
users
notifications

Future Swagger Tag:
Flags

---

# Notification APIs

## listNotifications

Function Name:
listNotifications

Purpose:
List authenticated user's notifications.

HTTP Method:
GET

Route:
/api/notifications

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "read": false,
  "type": ""
}
```

Success Response:
```json
{
  "success": true,
  "notifications": [],
  "unreadCount": 0,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
500 Server error

Notes:
Only return notifications for the authenticated user unless ADMIN endpoint is added separately.

Related Collections:
notifications
users

Future Swagger Tag:
Notifications

---

## markNotificationRead

Function Name:
markNotificationRead

Purpose:
Mark a single notification as read.

HTTP Method:
PATCH

Route:
/api/notifications/:notificationId/read

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
```json
{
  "notificationId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

Error Responses:
401 Unauthorized
403 Forbidden
404 Notification not found
500 Server error

Notes:
User may only update their own notifications.

Related Collections:
notifications

Future Swagger Tag:
Notifications

---

## markAllNotificationsRead

Function Name:
markAllNotificationsRead

Purpose:
Mark all authenticated user's notifications as read.

HTTP Method:
PATCH

Route:
/api/notifications/read-all

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "updatedCount": 0
}
```

Error Responses:
401 Unauthorized
500 Server error

Notes:
Should be idempotent.

Related Collections:
notifications

Future Swagger Tag:
Notifications

---

# Spark / Leaderboard APIs

## getSparkBalance

Function Name:
getSparkBalance

Purpose:
Return authenticated user's spark balance and reputation summary.

HTTP Method:
GET

Route:
/api/sparks/balance

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "sparkBalance": 0,
  "reputation": 0
}
```

Error Responses:
401 Unauthorized
404 Profile not found
500 Server error

Notes:
Spark balance should be derived from trusted profile and transaction data.

Related Collections:
user_profiles
spark_transactions

Future Swagger Tag:
Leaderboard

---

## listSparkTransactions

Function Name:
listSparkTransactions

Purpose:
List authenticated user's spark transaction history.

HTTP Method:
GET

Route:
/api/sparks/transactions

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "type": "",
  "from": "",
  "to": ""
}
```

Success Response:
```json
{
  "success": true,
  "transactions": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
500 Server error

Notes:
Users should only see their own transactions. ADMIN can use a separate audit endpoint.

Related Collections:
spark_transactions
questions
answers
user_profiles

Future Swagger Tag:
Leaderboard

---

## getLeaderboard

Function Name:
getLeaderboard

Purpose:
Return ranked users or resolvers by reputation, accepted answers, or spark points.

HTTP Method:
GET

Route:
/api/leaderboard

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "period": "all",
  "type": "reputation",
  "role": "RESOLVER",
  "limit": 20
}
```

Success Response:
```json
{
  "success": true,
  "leaderboard": []
}
```

Error Responses:
400 Validation error
401 Unauthorized
500 Server error

Notes:
Use aggregation from profiles, answers, and spark transactions depending on leaderboard type.

Related Collections:
user_profiles
users
roles
user_role_mappers
answers
spark_transactions

Future Swagger Tag:
Leaderboard

---

# Admin APIs

## getAdminDashboard

Function Name:
getAdminDashboard

Purpose:
Return platform metrics for the admin dashboard.

HTTP Method:
GET

Route:
/api/admin/dashboard

Access Role:
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "from": "",
  "to": ""
}
```

Success Response:
```json
{
  "success": true,
  "metrics": {
    "users": 0,
    "questions": 0,
    "answers": 0,
    "openFlags": 0,
    "sparkTransactions": 0
  }
}
```

Error Responses:
401 Unauthorized
403 Forbidden
500 Server error

Notes:
Should aggregate operational metrics without exposing sensitive user secrets.

Related Collections:
users
questions
answers
comments
flags
spark_transactions
notifications

Future Swagger Tag:
Admin

---

## assignUserRole

Function Name:
assignUserRole

Purpose:
Assign a role to a user.

HTTP Method:
POST

Route:
/api/admin/users/:userId/roles

Access Role:
ADMIN

Request Body:
```json
{
  "role": "RESOLVER"
}
```

Path Params:
```json
{
  "userId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Role assigned"
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 User or role not found
409 Role already assigned
500 Server error

Notes:
Use user_role_mappers to preserve role assignment history if supported.

Related Collections:
users
roles
user_role_mappers
notifications

Future Swagger Tag:
Admin

---

## removeUserRole

Function Name:
removeUserRole

Purpose:
Remove a role from a user.

HTTP Method:
DELETE

Route:
/api/admin/users/:userId/roles/:roleName

Access Role:
ADMIN

Request Body:
None

Path Params:
```json
{
  "userId": "",
  "roleName": "RESOLVER"
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Role removed"
}
```

Error Responses:
401 Unauthorized
403 Forbidden
404 User role mapping not found
409 Cannot remove final admin role
500 Server error

Notes:
Protect against removing the last ADMIN account.

Related Collections:
users
roles
user_role_mappers
notifications

Future Swagger Tag:
Admin

---

## listAdminSparkTransactions

Function Name:
listAdminSparkTransactions

Purpose:
Audit spark transactions across the platform.

HTTP Method:
GET

Route:
/api/admin/sparks/transactions

Access Role:
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "userId": "",
  "type": "",
  "from": "",
  "to": ""
}
```

Success Response:
```json
{
  "success": true,
  "transactions": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
403 Forbidden
500 Server error

Notes:
Admin-only audit trail for reward, bounty, adjustment, and penalty transactions.

Related Collections:
spark_transactions
users
user_profiles
questions
answers

Future Swagger Tag:
Admin

---

# Expert / Resolver APIs

## getResolverQueue

Function Name:
getResolverQueue

Purpose:
List questions relevant to a resolver's expertise.

HTTP Method:
GET

Route:
/api/resolver/questions

Access Role:
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "category": "",
  "tag": "",
  "unanswered": true,
  "sort": "priority"
}
```

Success Response:
```json
{
  "success": true,
  "questions": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
403 Forbidden
500 Server error

Notes:
Queue may rank unanswered, high-bounty, and expertise-matched questions first.

Related Collections:
questions
answers
user_profiles
spark_transactions

Future Swagger Tag:
Questions

---

## getResolverStats

Function Name:
getResolverStats

Purpose:
Return resolver performance metrics.

HTTP Method:
GET

Route:
/api/resolver/stats

Access Role:
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "from": "",
  "to": ""
}
```

Success Response:
```json
{
  "success": true,
  "stats": {
    "answersCount": 0,
    "acceptedAnswersCount": 0,
    "acceptanceRate": 0,
    "sparkEarned": 0,
    "reputation": 0
  }
}
```

Error Responses:
401 Unauthorized
403 Forbidden
500 Server error

Notes:
Useful for resolver dashboard and leaderboard.

Related Collections:
answers
questions
spark_transactions
user_profiles

Future Swagger Tag:
Leaderboard

---

## updateResolverExpertise

Function Name:
updateResolverExpertise

Purpose:
Update resolver expertise categories and tags.

HTTP Method:
PATCH

Route:
/api/resolver/expertise

Access Role:
RESOLVER
ADMIN

Request Body:
```json
{
  "expertise": [],
  "categories": [],
  "tags": []
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "profile": {}
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
500 Server error

Notes:
ADMIN may update resolver expertise through a user-scoped admin variant if needed.

Related Collections:
user_profiles
users
roles
user_role_mappers

Future Swagger Tag:
Users

---

# Moderation APIs

## getModerationQueue

Function Name:
getModerationQueue

Purpose:
Return pending flagged content and items requiring admin review.

HTTP Method:
GET

Route:
/api/moderation/queue

Access Role:
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "page": 1,
  "limit": 20,
  "targetType": "",
  "priority": "",
  "status": "pending"
}
```

Success Response:
```json
{
  "success": true,
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
401 Unauthorized
403 Forbidden
500 Server error

Notes:
May be powered by flags plus content status fields from questions, answers, and comments.

Related Collections:
flags
questions
answers
comments
users
user_profiles

Future Swagger Tag:
Admin

---

## moderateContent

Function Name:
moderateContent

Purpose:
Apply a moderation decision to question, answer, or comment content.

HTTP Method:
PATCH

Route:
/api/moderation/content

Access Role:
ADMIN

Request Body:
```json
{
  "targetType": "question",
  "targetId": "",
  "action": "hide",
  "reason": ""
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Moderation action applied"
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 Target not found
500 Server error

Notes:
Actions may include approve, hide, restore, delete, lock, or unlock.

Related Collections:
questions
answers
comments
flags
notifications

Future Swagger Tag:
Admin

---

## warnUser

Function Name:
warnUser

Purpose:
Send a moderation warning to a user.

HTTP Method:
POST

Route:
/api/moderation/users/:userId/warn

Access Role:
ADMIN

Request Body:
```json
{
  "reason": "",
  "message": ""
}
```

Path Params:
```json
{
  "userId": ""
}
```

Query Params:
None

Success Response:
```json
{
  "success": true,
  "message": "Warning sent"
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
404 User not found
500 Server error

Notes:
Warning should create a notification and may also update moderation metadata if such fields exist.

Related Collections:
users
notifications
flags

Future Swagger Tag:
Admin

---

# Future APIs

## uploadAttachment

Function Name:
uploadAttachment

Purpose:
Upload an attachment for a question, answer, comment, or profile.

HTTP Method:
POST

Route:
/api/attachments

Access Role:
USER
RESOLVER
ADMIN

Request Body:
multipart/form-data

Path Params:
None

Query Params:
```json
{
  "targetType": "question",
  "targetId": ""
}
```

Success Response:
```json
{
  "success": true,
  "attachment": {
    "id": "",
    "url": "",
    "fileName": "",
    "mimeType": ""
  }
}
```

Error Responses:
400 Invalid file
401 Unauthorized
413 File too large
415 Unsupported media type
500 Server error

Notes:
Requires a future attachments collection or external object storage metadata strategy.

Related Collections:
Future attachments
questions
answers
comments
user_profiles

Future Swagger Tag:
Attachments

---

## suggestFAQWithAI

Function Name:
suggestFAQWithAI

Purpose:
Generate FAQ suggestions from existing questions and answers.

HTTP Method:
POST

Route:
/api/ai/faq-suggestions

Access Role:
ADMIN
RESOLVER

Request Body:
```json
{
  "category": "",
  "tags": [],
  "sourceQuestionIds": []
}
```

Path Params:
None

Query Params:
None

Success Response:
```json
{
  "success": true,
  "suggestions": []
}
```

Error Responses:
400 Validation error
401 Unauthorized
403 Forbidden
429 Rate limit exceeded
500 Server error

Notes:
Future AI feature. Generated output should be reviewed before publishing.

Related Collections:
questions
answers
comments
Future ai_suggestions

Future Swagger Tag:
AI

---

## getRecommendations

Function Name:
getRecommendations

Purpose:
Recommend questions, answers, or experts to the authenticated user.

HTTP Method:
GET

Route:
/api/recommendations

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "type": "questions",
  "limit": 10
}
```

Success Response:
```json
{
  "success": true,
  "recommendations": []
}
```

Error Responses:
400 Validation error
401 Unauthorized
500 Server error

Notes:
Can use tags, categories, expertise, accepted answers, and user activity.

Related Collections:
users
user_profiles
questions
answers
spark_transactions

Future Swagger Tag:
Recommendations

---

## search

Function Name:
search

Purpose:
Search questions, answers, users, and FAQ-like content.

HTTP Method:
GET

Route:
/api/search

Access Role:
USER
RESOLVER
ADMIN

Request Body:
None

Path Params:
None

Query Params:
```json
{
  "q": "",
  "type": "all",
  "category": "",
  "tags": [],
  "page": 1,
  "limit": 20
}
```

Success Response:
```json
{
  "success": true,
  "results": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Error Responses:
400 Validation error
401 Unauthorized
500 Server error

Notes:
Start with MongoDB text indexes. Future versions may use dedicated search infrastructure.

Related Collections:
questions
answers
comments
users
user_profiles

Future Swagger Tag:
Search

---

# API Dependency Map

```text
React Frontend
↓
Express API Routes
↓
Authentication and Authorization Middleware
↓
Controllers
↓
Services
↓
Mongoose Models
↓
MongoDB Collections
```

```text
Frontend
↓
API
↓
Controller
↓
Service
↓
Mongo Collections
```

Module dependency overview:

```text
Authentication APIs
↓
users, roles, user_role_mappers, user_profiles

Question APIs
↓
questions, answers, comments, flags, spark_transactions, notifications

Answer APIs
↓
answers, questions, comments, spark_transactions, notifications

Comment APIs
↓
comments, questions, answers, notifications

Flag and Moderation APIs
↓
flags, questions, answers, comments, users, notifications

Spark and Leaderboard APIs
↓
spark_transactions, user_profiles, answers, questions

Admin APIs
↓
all core collections
```

# Swagger Tag Plan

Authentication

Users

Questions

Answers

Comments

Flags

Notifications

Admin

Leaderboard

Future optional tags:

Attachments

AI

Recommendations

Search

# API Priority Table

| Priority | API / Module | Reason |
| --- | --- | --- |
| P0 | signup | Required for account creation |
| P0 | login | Required for authentication |
| P0 | logout | Required for session cleanup |
| P0 | me | Required for frontend session restoration |
| P0 | getMyProfile | Required for user dashboard |
| P0 | updateMyProfile | Required for basic account management |
| P0 | createQuestion | Core helpdesk workflow |
| P0 | listQuestions | Core feed and discovery workflow |
| P0 | getQuestionById | Core question detail workflow |
| P0 | updateQuestion | Required for owner edits |
| P0 | createAnswer | Core resolver and user response workflow |
| P0 | updateAnswer | Required for answer owner edits |
| P0 | acceptAnswer | Required to close question and reward answer |
| P0 | createComment | Basic discussion workflow |
| P0 | listComments | Basic discussion display |
| P0 | listNotifications | Required for user engagement |
| P0 | markNotificationRead | Required for notification UX |
| P0 | getSparkBalance | Required if spark is visible in MVP |
| P0 | listSparkTransactions | Required if spark accounting is visible in MVP |
| P1 | getUserById | Useful for public identity and profile views |
| P1 | getPublicProfile | Useful for author pages |
| P1 | deleteQuestion | Important for content ownership and cleanup |
| P1 | deleteAnswer | Important for content ownership and cleanup |
| P1 | deleteComment | Important for content ownership and cleanup |
| P1 | createFlag | Important for community moderation |
| P1 | listFlags | Important for admin moderation |
| P1 | resolveFlag | Important for admin moderation |
| P1 | getLeaderboard | Important for engagement |
| P1 | getResolverQueue | Important for expert workflow |
| P1 | getResolverStats | Important for expert dashboard |
| P1 | updateResolverExpertise | Important for expert matching |
| P1 | getAdminDashboard | Important for operations |
| P1 | listUsers | Important for admin user management |
| P1 | updateUserStatus | Important for admin safety controls |
| P1 | assignUserRole | Important for resolver and admin management |
| P1 | removeUserRole | Important for resolver and admin management |
| P1 | getModerationQueue | Important for scalable moderation |
| P1 | moderateContent | Important for scalable moderation |
| P1 | warnUser | Important for moderation communication |
| P2 | voteAnswer | Requires vote model or embedded vote strategy |
| P2 | listAdminSparkTransactions | Useful for audit and finance-like reporting |
| P2 | uploadAttachment | Future media support |
| P2 | suggestFAQWithAI | Future AI-assisted FAQ generation |
| P2 | getRecommendations | Future personalization |
| P2 | search | Future enhanced discovery |
