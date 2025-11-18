const pool = require('./pool');

const PAGE_SIZE = 10;

const getEmployeesByPage = async (page = 1) => {
  const offset = (page - 1) * PAGE_SIZE;

  const [rows] = await pool.query(
    'SELECT * FROM employees ORDER BY employeeNumber LIMIT ? OFFSET ?',
    [PAGE_SIZE, offset]
  );

  return rows;
};

const filterEmployees = async (filters = {}) => {
  let sql = `SELECT * FROM employees`;
  const conditions = [];
  const values = [];

  if (filters.employeeNumber) {
    conditions.push(`employeeNumber LIKE ?`);
    values.push(`%${filters.employeeNumber}%`);
  }

  if (filters.email) {
    conditions.push(`email LIKE ?`);
    values.push(`%${filters.email}%`);
  }

  if (filters.extension) {
    conditions.push(`extension LIKE ?`);
    values.push(`%${filters.extension}%`);
  }

  if (filters.lastName) {
    conditions.push(`lastName LIKE ?`);
    values.push(`%${filters.lastName}%`);
  }

  if (filters.firstName) {
    conditions.push(`firstName LIKE ?`);
    values.push(`%${filters.firstName}%`);
  }

  if (filters.jobTitle) {
    conditions.push(`jobTitle LIKE ?`);
    values.push(`%${filters.jobTitle}%`);
  }

  if (filters.officeCode) {
    conditions.push(`officeCode LIKE ?`);
    values.push(`%${filters.officeCode}%`);
  }

  if (filters.reportsTo) {
    conditions.push(`reportsTo LIKE ?`);
    values.push(`%${filters.reportsTo}%`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }

  sql += ` ORDER BY employeeNumber`;

  const [rows] = await pool.query(sql, values);
  return rows;
};

const addNewEmployee = async ({
  employeeNumber,
  lastName,
  firstName,
  extension,
  email,
  officeCode,
  reportsTo,
  jobTitle,
}) => {
  await pool.query(
    `
      INSERT INTO employees (
        employeeNumber, 
        lastName, 
        firstName, 
        extension,
        email, 
        officeCode, 
        reportsTo, 
        jobTitle
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employeeNumber,
      lastName,
      firstName,
      extension,
      email,
      officeCode,
      reportsTo,
      jobTitle,
    ]
  );
};

const deleteEmployee = async (employeeNumber) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE customers SET salesRepEmployeeNumber = NULL WHERE salesRepEmployeeNumber = ?`,
      employeeNumber
    );

    await conn.query(
      `UPDATE employees SET reportsTo = NULL WHERE reportsTo = ?`,
      employeeNumber
    );

    await conn.query(`DELETE FROM employees WHERE employeeNumber = ?`, [
      employeeNumber,
    ]);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const updateEmployee = async ({
  employeeNumber,
  lastName,
  firstName,
  extension,
  email,
  officeCode,
  reportsTo,
  jobTitle,
}) => {
  await pool.query(
    `UPDATE employees
     SET lastName = ?, firstName = ?, extension = ?, email = ?, officeCode = ?, reportsTo = ?, jobTitle = ?
     WHERE employeeNumber = ?`,
    [
      lastName,
      firstName,
      extension,
      email,
      officeCode,
      reportsTo,
      jobTitle,
      employeeNumber,
    ]
  );
};

const getEmployeesCount = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM employees');
  return rows[0].count;
};

module.exports = {
  getEmployeesByPage,
  filterEmployees,
  addNewEmployee,
  deleteEmployee,
  updateEmployee,
  getEmployeesCount,
};
