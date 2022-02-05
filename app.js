const inquirer = require('inquirer');
const conTable = require('console.table');
const db = require('./db/connection.js');


function init() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'query',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'None']
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
                } else {
                    console.log('Please enter a department');
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

// function addRole();

// function addEmployee();

// function updateEmployee();

// function addEmployee();

// function updateEmployee();

init();

