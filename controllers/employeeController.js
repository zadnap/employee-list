const db = require('../models/queries');

const renderEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const employees = await db.getEmployeesByPage(page);

    const totalEmployees = await db.getEmployeesCount();
    const totalPages = Math.ceil(totalEmployees / 10);

    res.render('employee-page', { employees, currentPage: page, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const addEmployee = async (req, res) => {
  try {
    const {
      employeeNumber,
      firstName,
      lastName,
      jobTitle,
      email,
      extension,
      officeCode,
      reportsTo,
    } = req.body;

    await db.addNewEmployee({
      employeeNumber,
      lastName,
      firstName,
      extension: extension || null,
      email,
      officeCode: officeCode || null,
      reportsTo: reportsTo || null,
      jobTitle,
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Invalid employee information');
  }
};

module.exports = { renderEmployee, addEmployee };
