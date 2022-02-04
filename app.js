const inquirer = require('inquirer');
const db = require('./db/connection.js')

function init() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'query',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
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
        }
    });
};

function displayDepartment() {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        console.table(rows);
        console.log()
    })
};

function displayRoles() {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        console.table(rows);
    })
};

function displayEmployees() {
    const sql = `SELECT * FROM employees`;
    db.query(sql, (err, rows) => {
        console.table(rows);
    })
};

// function addDepartment();

// function addRole();

// function addEmployee();

// function updateEmployee();

// function addEmployee();

// function updateEmployee();

init();