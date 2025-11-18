const dotenv = require('dotenv');
const express = require('express');
const path = require('node:path');
const employeeRouter = require('./routes/employeeRouter');

dotenv.config();
const app = express();
const PORT = process.env.EXPRESS_PORT || 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', employeeRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app is listening on port ${PORT}!`);
});
