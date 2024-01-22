# Fake Stack Overflow React Project

## Overview

This project is a simplified version of Stack Overflow built using React. It includes essential features like comments, upvoting, user authentication (login, logout, sign up), and user profile pages. The goal is to provide a familiar interface and functionality similar to Stack Overflow.

This project was built as part of a collaboration between the following GitHub users: Daniel Kogan (@daminals), Gretta Hallolari (@ingrettable).

## Features

### 1. Comments

- Users can add comments to questions and answers.
- Comments support markdown formatting for text styling.

### 2. Upvoting

- Users can upvote questions, answers, and comments.
- The voting system helps prioritize valuable content.

### 3. User Authentication

- Users can create accounts, log in, and log out.
- Authentication ensures that actions like commenting and upvoting are tied to specific users.

### 4. User Profile Page

- Each user has a profile page displaying their activity.
- The profile includes information such as questions asked, answers provided, and upvotes received.

### Additional Features

- **Question and Answer System**: Users can ask questions and receive answers.
- **Search Functionality**: Users can search for questions based on keywords.
- **Tagging System**: Questions can be tagged with relevant topics for easier categorization.
- **Notifications**: Users receive notifications for activities like upvotes and new comments.
- **Moderation Tools**: Admins or moderators can manage content and users.

## Tech Stack
- MongoDB
- React
- Express
- Node.js

## Getting Started
```bash
# open terminal
cd server
npm install
node populate_db.js
node init.js # ENTER YOUR USERNAME AND PASSWORD FOR ADMIN USER. THE LOGIN EMAIL IS "admin@admin.com" 
npm start

# Open another terminal
cd ..
cd client
npm install
npm start
```

## Acknowledgments

Inspiration: Stack Overflow for providing a rich platform for programming-related discussions.
Icons: Icons used in the project are sourced from FontAwesome.
