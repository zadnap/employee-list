const db = require('../models/queries');

const renderEmployee = async (req, res) => {
  const employees = await db.getEmployeesByPage();

  res.render('employee-page', { employees });
};

module.exports = { renderEmployee };
