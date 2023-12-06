// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')

const bcrypt = require('bcrypt');
const User = require('./models/users');


let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// create server with express

const express = require('express');
const app = express();
// const cors = require('cors');
const port = 8000;
app.use(express.json());


// cors middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// check email exists

app.post('/checkEmail', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route
app.post('/checkUsername', async (req, res) => {
  const { username } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking username existence:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


//register 
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
   // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: password,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//login 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'No User' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.json({ message: 'Login successful', email: user.email, user: user.username });
    } else {
      console.log(email, password, passwordMatch, user.password)
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/posts/questions', async (req, res) => {
  console.log(req.body)
  const { title, text, tags, asked_by, ask_date_time, views } = req.body;

  try {
    const newQuestion = new Question({ title, text, tags, asked_by, ask_date_time, views });
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating a new question:', error);
    res.status(500).send(error);
  }
});

// Update a specific question by ID
// app.put('/posts/questions/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, text, tags, asked_by, ask_date_time, views } = req.body;

//   try {
//     const updatedQuestion = await Question.findByIdAndUpdate(
//       id,
//       { title, text, tags, asked_by, ask_date_time, views },
//       { new: true, useFindAndModify: false }
//     );
//     res.json(updatedQuestion);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Get all questions
app.get('/posts/questions', async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific question by ID
app.get('/posts/questions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);
    res.json(question);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/posts/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { answerID } = req.body;
  const { views } = req.body;

  try {
    const updatedData = {};

    if (answerID) {
      updatedData.$push = { answers: answerID };
    }

    if (views !== undefined) {
      updatedData.views = views;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, useFindAndModify: false }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).send(error);
  }
});



// TAGS!!!!

// Create a new tag
app.post('/posts/tags', async (req, res) => {
  const { name } = req.body;

  try {
    const newTag = new Tag({ name });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific tag by ID
app.put('/posts/tags/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, useFindAndModify: false }
    );
    res.json(updatedTag);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all tags
app.get('/posts/tags', async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific tag by ID
app.get('/posts/tags/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await Tag.findById(id);
    res.json(tag);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ANSWERS!!!!


// Create a new answer
app.post('/posts/answers', async (req, res) => {
  const { text, ans_by, ans_date_time } = req.body;

  try {
    const newAnswer = new Answer({ text, ans_by, ans_date_time });
    const savedAnswer = await newAnswer.save();
    res.status(201).json(savedAnswer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific answer by ID
app.put('/posts/answers/:id', async (req, res) => {
  const { id } = req.params;
  const { text, ans_by, ans_date_time } = req.body;

  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
      id,
      { text, ans_by, ans_date_time },
      { new: true, useFindAndModify: false }
    );
    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all answers
app.get('/posts/answers', async (req, res) => {
  try {
    const answers = await Answer.find({});
    res.json(answers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific answer by ID
app.get('/posts/answers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const answer = await Answer.findById(id);
    res.json(answer);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});