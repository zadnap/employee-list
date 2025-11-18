const { Router } = require('express');
const { renderEmployee } = require('../controllers/employeeController');

const employeeRouter = Router();

employeeRouter.get('/', renderEmployee);

module.exports = employeeRouter;
