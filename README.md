# Task-Manager-API: A node.js rest API

<h2>DESCRIPTION</h2>
A node.js based task manager API with all the CRUD operations. The server communicates with the mongodb database for storing the data for users and tasks created by the users.<br>
Authentication is also implemented using Json web tokens. This rest API can be integrated with any modern frontend technology. For this use case, flutter SDK has been used<br>
to build a front end which communicates with the rest API essentially resulting into a full stack project.<br>
<h3>SCOPE</h3>
The scope of this project is to showcase the author's understanding and ability to make node.js applications which are completely separated from the front-end logic.

<h3>API endpoints: </h3>

| Endpoint | Usage | Http Method |
| -------- | -------------------- | -------- |
| /user/new | New user signup | POST | 
| /user/login | User login | POST |
| /user/me | Send user profile | GET | 
| /user/logout | Logout a logged in user | POST | 
| /user/logoutall | Logout a user from all sessions | POST | 
| /user/me | Update a user profile | PATCH | 
| /user/me | Delete a user from the database | DELETE |
| /task/new | Create new task | POST | 
| /task/all | Return all tasks | GET | 
| /task/:id | Return a task | GET | 
| /task/:id | Update a task | PATCH | 
| /task/:id | Delete a task | DELETE |
