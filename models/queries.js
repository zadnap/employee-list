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

  if (filters.lastName) {
    conditions.push(`lastName LIKE ?`);
    values.push(`%${filters.lastName}%`);
  }

  if (filters.firstName) {
    conditions.push(`firstName LIKE ?`);
    values.push(`%${filters.firstName}%`);
  }

  if (filters.jobTitle) {
    conditions.push(`jobTitle = ?`);
    values.push(filters.jobTitle);
  }

  if (filters.officeCode) {
    conditions.push(`officeCode = ?`);
    values.push(filters.officeCode);
  }

  if (filters.reportsTo) {
    conditions.push(`reportsTo = ?`);
    values.push(filters.reportsTo);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }

  sql += ` ORDER BY employeeNumber`;

  const [rows] = await pool.query(sql, values);
  return rows;
};

const addNewEmployee = async (
  employeeNumber,
  lastName,
  firstName,
  extension,
  email,
  officeCode,
  reportsTo,
  jobTitle
) => {
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
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
      `UPDATE employees SET reportsTo = NULL WHERE reportsTo = ?`,
      [employeeNumber]
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

module.exports = {
  getEmployeesByPage,
  filterEmployees,
  addNewEmployee,
  deleteEmployee,
};
