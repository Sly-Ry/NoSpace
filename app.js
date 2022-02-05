const inquirer = require('inquirer');
const conTable = require('console.table');
const db = require('./db/connection.js');


function init() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'query',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'End App']
        }
    ])
    .then(choice => {
        switch (choice.query) {
            case 'view all departments':
                displayDepartment();
                break;
            case 'view all roles':
                displayRoles();
                break;
            case 'view all employees':
                displayEmployees();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'update an employee role':
                updateEmployee();
            default:
                db.end();
        }
    });
};

function displayDepartment() {
    console.log('Displaying all departments:');
    const sql = `SELECT 
        departments.id AS id, departments.name AS departments 
        FROM departments
        `;

    db.promise().query(sql)
        .then(([ rows ]) => {
            console.table(rows);
            init();
        })
        .catch(err => {
            throw err;
        });
};

function displayRoles() {
    console.log('Displaying all job titles:');
    const sql = `SELECT 
        roles.id, 
        roles.title, 
        roles.salary, 
        departments.name AS departments FROM roles
        INNER JOIN departments 
        ON roles.department_id = departments.id
        `;

    db.promise().query(sql)
        .then(([ rows ]) => {
            console.table(rows);
            init();
        })
        .catch(err => {
            throw err;
        });
};

function displayEmployees() {
    console.log('Displaying all employees:');
    const sql = `SELECT 
        employees.id, 
        employees.first_name,
        employees.last_name,
        roles.title,
        departments.name AS departments,
        roles.salary,
        CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees manager ON employees.manager_id = manager.id
        `;

    db.promise().query(sql)
        .then(([ rows ]) => {
            console.table(rows);
            init();
        })
        .catch(err => {
            throw err;
        });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What department would you like to add?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } 
                else {
                    console.log('Please enter a department!');
                    return false;
                }
            }
        }
    ])
    .then(dept => {
        const sql = `INSERT INTO 
            departments (name)
            VALUES (?)`;

        db.query(sql, dept.addDept, (err, rows) => {
            if (err) throw err;
            console.log('Added ' + dept.addDept + ' to departments!')
        });

        displayDepartment();
    });
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What role would you like to add?',
            validate: addTitle => {
                if (addTitle) {
                    return true;
                } 
                else {
                    console.log('Please enter a role!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role? Ex: (29.99)',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    console.log(' Please enter the salary!');
                    return false;
                } 
                else {
                    return true;
                }
            }
        }
    ])
    .then(data => {
        // an array to hold role data
        const params = [data.title, data.salary];

        const roleSql = `SELECT name, id FROM departments`;
        
        db.query(roleSql, (err, data) => {
            if(err) throw err;

            // map through our Departments table and make them choices for the inquirer
            const dept = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ])
            .then(deptChoice => {
                const roleDept = deptChoice.dept;
                // push department choice into role data array
                params.push(roleDept);

                const sql = `INSERT INTO 
                    roles (title, salary, department_id)
                    VALUES (?, ?, ?)
                    `;

                db.query(sql, params, (err, rows) => {
                    if (err) throw err;
                    console.log('Added' + data.role + " to roles!"); 

                    displayRoles();
                })
            })
        }) 
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                }
                else {
                    console.log('Please enter a first name.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                }
                else {
                    console.log('Please enter a last name.');
                    return false;
                }
            }
        }
    ])
    .then(data => {
        const params = [data.firstName, data.lastName]

        const roleSql = `SELECT roles.id, roles.title FROM roles`

        db.query(roleSql, (err, data) => {
            if(err) throw err;

            // map through our Roles table and make them choices for the inquirer
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is this employee's role?",
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const empRole = roleChoice.role;

                params.push(empRole);

                const managerSql = `SELECT * FROM employees`;

                db.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) =>
                        ({ name: first_name + " " + last_name, value: id }));
                    
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is this employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const empMan = managerChoice.manager;

                        params.push(empMan);

                        const sql = `INSERT INTO employees 
                            (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`;
                        
                        db.query(sql, params, (err, rows) => {
                            if (err) throw err;
                            console.log('Employee has been added!')

                            displayEmployees();
                        });
                    });
                });
            });
        }); 
    });
};

// function updateEmployee();


init();

