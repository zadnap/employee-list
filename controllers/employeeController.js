const db = require('../models/queries');

const renderEmployee = async (req, res) => {
  const employees = await db.getEmployeesByPage();

  res.render('employee-page', { employees });
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
