const express = require('express');

const { questions } = require('./questions');

const app = express();
app.use(express.json());

// Route to retrieve questions
app.get('/questions', (req, res) => {
  res.json(questions);
});

// Route to submit quiz data
app.post('/submit', (req, res) => {
  // Process quiz data here
  const { name, score, options } = req.body;
  console.log(
    `Quiz data submitted by ${name}: score ${score}, options ${options}`
  );
  res.json({ success: true });
});

// Route to handle user sign-up
app.post('/signup', (req, res) => {
  // Process user sign-up data here
  console.log(req.body);
  const { email, password } = req.body;
  console.log(`User sign-up: email ${email}, password ${password}`);
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
