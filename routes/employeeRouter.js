const { Router } = require('express');
const {
  renderEmployee,
  addEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const employeeRouter = Router();

employeeRouter.get('/', renderEmployee);
employeeRouter.post('/add', addEmployee);
employeeRouter.post('/delete', deleteEmployee);

module.exports = employeeRouter;
