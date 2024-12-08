# Express App with Redis and Firebase

This project is a containerized Express.js app that integrates Redis for caching and Firebase for backend services. Below are the instructions on how to set up and run the application.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (for containerization)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running tests locally)
- [Firebase Project](https://firebase.google.com/) (for Firebase integration)

## Setting Up the Application

1. **Clone the Repository**

   First, clone the repository to your local machine:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Populate the .env File**

   Create a .env file in the root directory of the project and populate it with the following required credentials:

   ```bash
   REDIS_HOST=redis
   REDIS_PORT=6379
   FIREBASE_API_KEY=<your-firebase-api-key>
   ```

3. **Place Firebase Service Account Key**
- Copy the serviceAccountKey.json file from your Firebase project's settings (found under Project Settings > Service Accounts).
- Paste this serviceAccountKey.json file in the root directory of the project.

4. **Build and Start the Application**
After setting up the .env file and adding the Firebase credentials, you can start the application using Docker Compose:

   ```bash
   docker-compose up
   ```
This will build the application, create the necessary containers, and start the Express app and Redis service.

	- The app will be available at **http://localhost:3000**.
	- Documentation for the app will be available at **http://localhost:3000/api-docs**
	- Redis will be running on localhost:6379.

5. **Running tests**

   ```bash
   npm test
   ```
