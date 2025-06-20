# LexiNote

LexiNote is a modern, full-stack cloud-based note-taking application. It allows users to securely register, log in, and manage their notes from any device. Notes are stored in the cloud, and users can create, edit, and delete notes with a beautiful, responsive UI. The app features authentication, user profile management, avatar uploads, pagination, and a consistent, calming color palette for a delightful user experience.

---

## What I Learned

Working on LexiNote, I learned:
- **MongoDB Atlas**: How to set up, connect, and manage a cloud MongoDB database, including IP whitelisting and cluster management.
- **Express.js**: Building RESTful APIs, structuring backend code, and handling authentication and middleware.
- **Authentication**: Implementing secure registration, login, JWT-based authentication, and protected routes.
- **UI/UX Design**: Designing a consistent, modern UI using a color palette, and building a responsive, user-friendly React frontend.

---

## Technologies Used

- **MongoDB Atlas**: Cloud database for storing users and notes. Chosen for its scalability, reliability, and ease of setup.
- **Express.js**: Backend framework for building REST APIs. Chosen for its simplicity and flexibility.
- **Node.js**: JavaScript runtime for the backend.
- **Mongoose**: ODM for MongoDB, making schema and data validation easy.
- **React**: Frontend library for building a dynamic, component-based UI.
- **JWT (jsonwebtoken)**: For secure, stateless authentication.
- **bcryptjs**: For password hashing.
- **Multer**: For handling avatar uploads.
- **CORS**: To enable cross-origin requests between frontend and backend during development.
- **Postman**: For testing API endpoints.

---

## Project Structure

```
lexinote/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    server.js
    package.json
    ...
  frontend/
    public/
    src/
      components/
      App.js
      index.js
      ...
    package.json
    ...
  README.md
```

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/prathamm-k/LexiNote-Cloud-Based-Notes-App.git
cd LexiNote-Cloud-Based-Notes-App
```

### 2. Setup MongoDB Atlas
- Go to [MongoDB Atlas](https://cloud.mongodb.com/).
- Create a free cluster.
- Add a database user and password.
- Whitelist your current IP address in Network Access.
- Get your connection string and use it in your `.env` as `MONGO_URI`.

### 3. Setup the Backend
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` folder:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

#### Start the Backend Server
```bash
npm start
# or for development with auto-reload:
npx nodemon server.js
```

### 4. Setup the Frontend
```bash
cd ../frontend
npm install
npm start
```
The frontend will run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000).

### 5. Test the API with Postman
- Import the API endpoints (see below).
- Register a user via `POST /api/auth/register`.
- Log in via `POST /api/auth/login` to get a JWT token.
- Use the token as a Bearer token for all protected endpoints (notes, user profile, etc).
- Test creating, updating, and deleting notes.

---

## File Explanations

### Backend
- **server.js**: Entry point, sets up Express, connects to MongoDB, and mounts routes.
- **models/User.js**: Mongoose schema for users.
- **models/Note.js**: Mongoose schema for notes (with title and text).
- **controllers/authController.js**: Handles registration and login.
- **controllers/notesController.js**: Handles CRUD for notes, including extracting the title from note text.
- **controllers/userController.js**: Handles user profile, password, and avatar updates.
- **middleware/auth.js**: JWT authentication middleware.
- **routes/auth.js**: Auth endpoints (register, login).
- **routes/notes.js**: Note endpoints (CRUD, protected).
- **routes/user.js**: User profile and avatar endpoints.
- **uploads/**: Stores uploaded avatar images.
- **config/**: (Reserved for future configs).

### Frontend
- **src/App.js**: Main React component, handles routing, authentication, and state.
- **src/components/**: Contains all UI components (NotesList, Note, AddNote, Login, Register, UserSettings, etc).
- **src/index.js**: React entry point.
- **src/index.css**: Global styles and theming.
- **public/**: Static assets and HTML template.

---

## API & Database Communication

- The **frontend** communicates with the **backend** via RESTful API calls (using `fetch`).
- The **backend** uses Express routes to handle requests, authenticate users, and interact with MongoDB via Mongoose.
- **Authentication**: JWT tokens are issued on login/register and sent in the `Authorization` header for protected routes.
- **Notes**: When a note is created or updated, the backend extracts the first line as the title and stores both title and text in MongoDB.
- **User Profile**: Users can update their email, username, password, and avatar. Avatars are uploaded and served from the backend.

---

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [JWT](https://jwt.io/)
- [UI Avatars](https://ui-avatars.com/)
- [Postman](https://www.postman.com/)

---

## Contact

For questions or feedback, please open an issue or contact me through [MAIL](kairamkondapratham@gmail.com).
