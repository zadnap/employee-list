const pool = require('./pool');

const PAGE_SIZE = 10;

const buildFilterQuery = (filters = {}) => {
  const conditions = [];
  const values = [];
  const filterFields = [
    'employeeNumber',
    'email',
    'extension',
    'lastName',
    'firstName',
    'jobTitle',
    'officeCode',
    'reportsTo',
  ];

  filterFields.forEach((field) => {
    if (filters[field]) {
      conditions.push(`${field} LIKE ?`);
      values.push(`%${filters[field]}%`);
    }
  });

  const whereClause =
    conditions.length > 0 ? ` WHERE ` + conditions.join(' AND ') : '';

  return { whereClause, values };
};

const getEmployeeCount = async (filters = {}) => {
  const { whereClause, values } = buildFilterQuery(filters);
  const sql = `SELECT COUNT(*) AS count FROM employees${whereClause}`;
  const [rows] = await pool.query(sql, values);

  return rows[0].count;
};

const getEmployees = async (page = 1, filters = {}) => {
  const { whereClause, values } = buildFilterQuery(filters);
  const offset = (page - 1) * PAGE_SIZE;
  let sql = `SELECT * FROM employees${whereClause}`;

  sql += ` ORDER BY employeeNumber LIMIT ? OFFSET ?`;

  values.push(PAGE_SIZE);
  values.push(offset);

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

module.exports = {
  PAGE_SIZE,
  getEmployeeCount,
  getEmployees,
  addNewEmployee,
  deleteEmployee,
  updateEmployee,
};
