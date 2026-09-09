# AIKYA — One Campus. Everything Connected.

AIKYA is an AI-powered Smart Campus Digital Twin that brings important campus information into one platform.

It helps students and staff find buildings, classrooms, faculty, food shops, hostels, buses, services and events. The AI assistant can also answer campus-related questions using the information stored in the system.

---

## What AIKYA Provides

- Interactive campus map
- Building / Bhavan navigation
- Floor and room information
- Faculty directory
- Department information
- Canteen and food shop information
- Hostel room occupancy and warden details
- Bus routes, timings and driver details
- Campus services such as library and medical centre
- Campus events and activities
- AI-powered campus assistant
- Google Maps directions
- Admin panel for managing campus information

---

## Technology Used

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- MongoDB Atlas

### AI
- Grok API by xAI

---

## Project Structure

AIKYA/
│
├── client/          # Frontend
├── server/          # Backend
├── docs/            # Documentation
└── README.md        # Project information

---

# Installation Requirements

Before running the project, install:

- Node.js 18 or above
- npm
- MongoDB / MongoDB Atlas
- Git
- xAI API key

Check Node.js and npm:

```bash
**node -v
npm -v
Installation
1. Clone the Project
git clone https://github.com/satya-sri-karri/AikyA.git

Move into the project folder:

cd AikyA
2. Install Frontend Dependencies

Open a terminal and run:

cd client
npm install
3. Install Backend Dependencies

Open another terminal and run:

cd server
npm install
Environment Setup

The backend requires the MongoDB connection and AI API key.

Inside the server folder, create a file named:

.env

Add:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

XAI_API_KEY=your_xai_api_key

GROK_MODEL=grok-4.6

JWT_SECRET=your_jwt_secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password

Replace the values with your actual credentials.

Do not upload the .env file to GitHub.

Running the Project

AIKYA contains a frontend and a backend, so both need to be running.

Step 1 — Start the Backend

Open a terminal:

cd AikyA/server
npm run dev

The backend will run on:

http://localhost:5000

If npm run dev is not available, use:

npm start
Step 2 — Start the Frontend

Open another terminal:

cd AikyA/client
npm run dev

Vite will display the local website address in the terminal.

Usually:

http://localhost:5173

Open the displayed address in a browser.

How to Use AIKYA

After opening the website:

Explore the campus using the map.
Select a Bhavan to view its information.
Navigate through floors and rooms.
Search for faculty and departments.
Check food shops and available food items.
View hostel information.
Check bus routes and timings.
View campus services.
Check upcoming events.
Ask questions using the AI assistant.
Use Google Maps for directions.
Use the Admin Panel to update campus information.
Example AI Questions

You can ask the AI assistant questions such as:

Where are the classrooms for first year CSE students?

Where is the CSE department?

Which faculty are available?

Where is the library?

What food is available in the canteen?

What are the bus routes?

Who is the driver of this bus?

Which hostel rooms are vacant?

Who is the hostel warden?

When does the library open?

Where is the medical centre?

What events are happening today?

The AI assistant uses the campus information stored in the database to answer these questions.

Admin Panel

The Admin Panel is used to manage the information shown in AIKYA.

The administrator can add, edit or delete information such as:

Buildings / Bhavans
Floors
Rooms
Departments
Faculty
Food shops
Food items
Hostels
Hostel rooms
Wardens
Bus routes
Drivers
Campus services
Events

This makes the system easy to maintain.

For example, if a classroom is moved from one Bhavan to another, the administrator can update its location from the Admin Panel without changing the application code.

Campus Data

AIKYA stores campus information in MongoDB.

The database contains information related to:

Buildings
Departments
Faculty
Rooms
Points of interest
Food shops
Hostels
Bus routes
Events
Campus services
AI queries

The data can be updated through the Admin Panel.

AI Assistant

The AI assistant is connected to the campus database.

When a user asks a question:

User Question
      ↓
AIKYA understands the question
      ↓
Campus information is retrieved
      ↓
Relevant information is given to the AI
      ↓
AI generates the answer
      ↓
Answer is shown to the user

The purpose of this approach is to make the AI answer based on available campus information rather than randomly generating campus details.

Google Maps

AIKYA can provide map directions for campus locations.

Users can select a location and open it in Google Maps to get directions.

Important Note

The project currently contains demo campus data for demonstration purposes.

The actual campus information can be added or modified through the Admin Panel.

This allows AIKYA to be adapted to a real university without changing the main application.

Troubleshooting
Backend is not starting

Check that:

Node.js is installed
Backend dependencies are installed
.env exists inside the server folder
MongoDB connection details are correct

Try:

cd server
npm install
npm run dev
Frontend is not starting

Try:

cd client
npm install
npm run dev
AI Assistant is not responding

Check the following value in .env:

XAI_API_KEY=your_xai_api_key

Also make sure that the backend is running.

MongoDB is not connecting

Check:

MONGODB_URI=your_mongodb_connection_string

If using MongoDB Atlas, make sure your current IP address is allowed in the MongoDB Atlas Network Access settings.

Project Goal

AIKYA aims to make a university campus easier to explore, understand and navigate by connecting campus data, maps and AI in one platform.

Instead of searching through different sources for information about classrooms, faculty, buses, food, hostels, services and events, users can access everything from one place.

AIKYA
One Campus. Everything Connected.**
