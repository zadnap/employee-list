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
      employees = await db.getEmployees(page, filters);
      totalItems = await db.getEmployeeCount(filters);
    } else {
      employees = await db.getEmployees(page);
      totalItems = await db.getEmployeeCount();
    }

    const totalPages = Math.ceil(totalItems / db.PAGE_SIZE);

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

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateNumber = (value) => {
  return value !== undefined && value !== null && !isNaN(Number(value));
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

    if (!employeeNumber || !validateNumber(employeeNumber)) {
      return res.status(400).send('Invalid employee number');
    }
    if (!firstName || firstName.length > 50) {
      return res.status(400).send('Invalid first name');
    }
    if (!lastName || lastName.length > 50) {
      return res.status(400).send('Invalid last name');
    }
    if (!jobTitle || jobTitle.length > 50) {
      return res.status(400).send('Invalid job title');
    }
    if (!email || !validateEmail(email) || email.length > 100) {
      return res.status(400).send('Invalid email');
    }
    if (extension && extension.length > 10) {
      return res.status(400).send('Extension too long');
    }
    if (officeCode && officeCode.length > 10) {
      return res.status(400).send('Office code too long');
    }
    if (reportsTo && !validateNumber(reportsTo)) {
      return res.status(400).send('reportsTo must be a number');
    }

    await db.addNewEmployee({
      employeeNumber: Number(employeeNumber),
      lastName,
      firstName,
      extension: extension || null,
      email,
      officeCode: officeCode || null,
      reportsTo: reportsTo ? Number(reportsTo) : null,
      jobTitle,
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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

    if (!employeeNumber || !validateNumber(employeeNumber)) {
      return res.status(400).send('Invalid employee number');
    }

    const updatedData = { employeeNumber };

    if (firstName !== undefined) {
      if (!firstName || firstName.length > 50)
        return res.status(400).send('Invalid first name');
      updatedData.firstName = firstName;
    }
    if (lastName !== undefined) {
      if (!lastName || lastName.length > 50)
        return res.status(400).send('Invalid last name');
      updatedData.lastName = lastName;
    }
    if (jobTitle !== undefined) {
      if (!jobTitle || jobTitle.length > 50)
        return res.status(400).send('Invalid job title');
      updatedData.jobTitle = jobTitle;
    }
    if (email !== undefined) {
      if (!email || !validateEmail(email) || email.length > 100)
        return res.status(400).send('Invalid email');
      updatedData.email = email;
    }
    if (extension !== undefined) {
      if (extension.length > 10)
        return res.status(400).send('Extension too long');
      updatedData.extension = extension || null;
    }
    if (officeCode !== undefined) {
      if (officeCode.length > 10)
        return res.status(400).send('Office code too long');
      updatedData.officeCode = officeCode || null;
    }
    if (reportsTo !== undefined) {
      if (reportsTo && !validateNumber(reportsTo))
        return res.status(400).send('reportsTo must be a number');
      updatedData.reportsTo = reportsTo ? Number(reportsTo) : null;
    }

    await db.updateEmployee(updatedData);

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
