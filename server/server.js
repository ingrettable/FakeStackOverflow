// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Comment = require('./models/comments')

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


// get all users (userID, username, reputation, date joined)
app.get('/posts/users', async (req, res) => {
  try {
    const users = await User.find({});
    // remove password from each user
    users.forEach(user => {
      user.password = undefined;
    });
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

// update user by id
app.put('/posts/users/:id', async (req, res) => {
  // console.log("recieved")
  const { id } = req.params;
  const { reputation } = req.body;

  try {
    const updatedData = {};

    if (reputation !== undefined) {
      updatedData.reputation = reputation;
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, useFindAndModify: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send(error);
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
      res.json({ message: 'Login successful', userID: user._id, email: user.email, user: user.username, reputation: user.reputation, is_admin: user.is_admin, dateJoined: user.date_joined, isLoggedIn: true });
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
    // Convert each question to a plain JavaScript object, including virtuals
    const questionsWithVirtuals = questions.map(question => question.toObject({ virtuals: true }));

    res.json(questionsWithVirtuals);
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
  const {
    answerID,
    views,
    upvoted_by,
    downvoted_by,
    title,
    text,
    tags,
    comment
  } = req.body;

  try {
    const updatedData = {};

    if (answerID) {
      updatedData.$push = { answers: answerID };
    }

    if (views !== undefined) {
      updatedData.views = views;
    }

    if (upvoted_by !== undefined) {
      // get user id from each element
      // console.log(upvoted_by)
      // const upvoted_by_object_ids = upvoted_by.map(async id => await User.findById(id));
      updatedData.upvoted_by = upvoted_by;
    }

    if (downvoted_by !== undefined) {
      // convert each element to object id
      // console.log(downvoted_by)
      // const downvoted_by_object_ids = downvoted_by.map(async id => await User.findById(id));
      updatedData.downvoted_by = downvoted_by;
    }

    if (comment !== undefined) {
      // add comment to existing list
      updatedData.$push = { comments: comment };
    }

    if (title !== undefined) {
      updatedData.title = title;
    }

    if (text !== undefined) {
      updatedData.text = text;
    }

    if (tags !== undefined) {
      updatedData.tags = tags;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, useFindAndModify: false }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    // console.log("FED DATA", updatedData,"UPDATED QUESTION", updatedQuestion)
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).send(error);
  }
});
// DELETE QUESTION
app.delete('/posts/questions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // ALL ANSWERS ASSOCIATED WITH QUESTION SHOULD BE DELETED TOO
    const deletedQuestion = await Question.findByIdAndDelete(id);

    const answers = deletedQuestion.answers;
    // loop thru each answer id
    for (const answer_id of answers) {
      // delete answer
      const deletedAnswer = await Answer.findByIdAndDelete(answer_id);

      if (!deletedAnswer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
      // console.log("DELETED ANSWER", deletedAnswer)
    }

    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(deletedQuestion);
  } catch (error) {
    res.status(500).send(error);
  }
});


// DELETE USER
app.delete('/posts/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// TAGS!!!!

// Create a new tag
app.post('/posts/tags', async (req, res) => {
  const { name, creator } = req.body;

  try {
    const newTag = new Tag({ name, creator });
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
    // get virtual properties 
    const tagsWithVirtuals = tags.map(tag => tag.toObject({ virtuals: true }));
    res.json(tagsWithVirtuals);
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

// delete tag by id
app.delete('/posts/tags/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(deletedTag);
  } catch (error) {
    res.status(500).send(error);
  }
});

// update tag name by id
app.put('/posts/tags/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {

    // first remove tag from all questions
    const questions = await Question.find({});
    // loop thru each question
    for (const question of questions) {
      // if question has tag
      if (question.tags.includes(id)) {
        // remove tag from question
        const updatedQuestion = await Question.findByIdAndUpdate(
          question._id,
          { $pull: { tags: id } },
          { new: true, useFindAndModify: false }
        );
        // console.log("UPDATED QUESTION", updatedQuestion)
      }
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, useFindAndModify: false }
    );
    return res.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
  }
})


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
  const { text, ans_by, ans_date_time, comment } = req.body;

  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
      id,
      { text, ans_by, ans_date_time },
      { new: true, useFindAndModify: false }
    );

    if (comment !== undefined) {
      const updatedData = {};
      // add comment to existing list
      updatedData.$push = { comments: comment };

      const updatedAnswer = await Answer.findByIdAndUpdate(
        id,
        updatedData,
        { new: true, useFindAndModify: false }
      );
    }

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

// create a new comment
app.post('/posts/comments', async (req, res) => {
  const { text, comment_by, comment_date_time, parentID } = req.body;
  // console.log("PARENT ID", parentID)
  // check if parent is question or answer
  try {
    const newComment = new Comment({ text, comment_by, comment_date_time });
    const savedComment = await newComment.save();
    // include virtual 
    const savedCommentWithVirtuals = savedComment.toObject({ virtuals: true });

    try {
      const question = await Question.findById(parentID);
      // console.log("QUESTION", question)
      // check if question exists
      if (question) {
        // add comment to question
        const updatedQuestion = await Question.findByIdAndUpdate(
          parentID,
          { $push: { comments: savedCommentWithVirtuals._id } },
          { new: true, useFindAndModify: false }
        );
        console.log("UPDATED QUESTION", updatedQuestion)
      } else {
        // add comment to answer
        const updatedAnswer = await Answer.findByIdAndUpdate(
          parentID,
          { $push: { comments: savedCommentWithVirtuals._id } },
          { new: true, useFindAndModify: false }
        );
        // console.log("UPDATED ANSWER", updatedAnswer)
      }
    } catch {
      console.error('Error updating question or answer:', error);
    }
  
    console.log("SAVED COMMENT", savedCommentWithVirtuals)
    res.json(savedCommentWithVirtuals);
  } catch (error) {
    res.status(500).send(error);
  }
});
// get all comments
app.get('/posts/comments', async (req, res) => {
  // get it all 
  try {
    const comments = await Comment.find({});
    // include virtual 
    const commentsWithVirtuals = comments.map(comment => comment.toObject({ virtuals: true }));
    res.json(commentsWithVirtuals);
  } catch (error) {
    res.status(500).send(error);
  }
})

// update comment by id
app.put('/posts/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { upvoted_by } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { upvoted_by },
      { new: true, useFindAndModify: false }
    );
    res.json(updatedComment);
  } catch (error) {
    res.status(500).send(error);
  }
})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});