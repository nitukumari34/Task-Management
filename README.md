Welcome to the Task Management API. This API is designed to empower individuals by providing a robust task management system tailored to the needs of creators and influencers. Below you'll find instructions on how to use the API along with details about its functionalities and implementation.

**Technologies Used**

Node.js
Express.js
MongoDB with Mongoose
JWT for authentication
Twilio for voice calling

**Setup**

Clone the repository from GitHub.

Install dependencies using npm install.

Set up your MongoDB database and update the connection string in config.js.

Generate a JWT secret key and update it in config.js.

Set up a Twilio account and update the credentials in config.js.

Start the server using npm start.

**API Endpoints**

/register: Registers a new user.

/login: Logs in an existing user.

/createTask: Creates a new task for the authenticated user.

/updateTask: Updates an existing task for the authenticated user.

/getAllUserTask: Retrieves all tasks for the authenticated user.

/getAllSubtask: Retrieves all subtasks for the authenticated user, optionally filtered by task.

/updateStatusSubtask: Updates the status of a subtask for the authenticated user.

/deleteTask: Soft deletes a task for the authenticated user.

/deleteSubtask: Soft deletes a subtask for the authenticated user.

**Cron Jobs**

Priority Change: Cron job to adjust task priorities based on due dates.
Twilio Voice Calling: Cron job to initiate voice calls using Twilio for overdue tasks, prioritized by user priority.

**Error Handling and Validation**

Input validation is implemented for all API endpoints.

Proper error handling is implemented for user-friendly error messages.

Authentication is required for accessing protected endpoints using JWT tokens.

**Subtask Model**

id: Unique identifier for the subtask.

task_id: Reference to the parent task.

status: 0 for incomplete, 1 for complete.

created_at: Timestamp of subtask creation.

updated_at: Timestamp of subtask update.

deleted_at: Timestamp of soft deletion.

**User Model**

id: Unique identifier for the user.

phone_number: User's phone number for Twilio calling.

priority: Priority level for Twilio calling (0, 1, 2).

T**ask Model**

id: Unique identifier for the task.

title: Title of the task.

description: Description of the task.

due_date: Due date of the task.

priority: Priority level of the task (0, 1, 2).

status: Task status (TODO, IN_PROGRESS, DONE).
