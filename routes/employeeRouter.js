const { Router } = require('express');
const {
  renderEmployee,
  addEmployee,
  deleteEmployee,
  updateEmployee,
} = require('../controllers/employeeController');

const employeeRouter = Router();

employeeRouter.get('/', renderEmployee);
employeeRouter.post('/add', addEmployee);
employeeRouter.post('/delete', deleteEmployee);
employeeRouter.post('/update', updateEmployee);

module.exports = employeeRouter;
