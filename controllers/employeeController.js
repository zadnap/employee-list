const db = require('../models/queries');

const renderEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const filters = {
      employeeNumber: req.query.employeeNumber || '',
      firstName: req.query.firstName || '',
      lastName: req.query.lastName || '',
      jobTitle: req.query.jobTitle || '',
      email: req.query.email || '',
      extension: req.query.extension || '',
      officeCode: req.query.officeCode || '',
      reportsTo: req.query.reportsTo || '',
    };
    const isFiltering = Object.values(filters).some((v) => v);
    let employees;
    let totalItems;

    if (isFiltering) {
      const filteredEmployees = await db.filterEmployees(filters);
      totalItems = filteredEmployees.length;

      const startIndex = (page - 1) * 10;
      employees = filteredEmployees.slice(startIndex, startIndex + 10);
    } else {
      employees = await db.getEmployeesByPage(page);
      totalItems = await db.getEmployeesCount();
    }

    const totalPages = Math.ceil(totalItems / 10);

    res.render('employee-page', {
      employees,
      totalEmployees: totalItems,
      currentPage: page,
      totalPages,
      filters,
    });
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

const deleteEmployee = async (req, res) => {
  try {
    const employeeNumber = parseInt(req.body.employeeNumber);
    if (!employeeNumber) {
      return res.status(400).send('Invalid employee number');
    }

    await db.deleteEmployee(employeeNumber);

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const updateEmployee = async (req, res) => {
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

    if (!employeeNumber) {
      return res.status(400).send('Invalid employee number');
    }

    await db.updateEmployee({
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
    res.status(500).send('Server error');
  }
};

module.exports = {
  renderEmployee,
  addEmployee,
  deleteEmployee,
  updateEmployee,
};
