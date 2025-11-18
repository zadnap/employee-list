const { Router } = require('express');
const {
  renderEmployee,
  addEmployee,
} = require('../controllers/employeeController');

const employeeRouter = Router();

employeeRouter.get('/', renderEmployee);
employeeRouter.post('/add', addEmployee);

module.exports = employeeRouter;
