const inquirer = require('inquirer');

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
                displeyRoles();
                break;
            case 'view all employees':
                displeyEmployees();
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
    })
}

function displayDepartment();

function displeyRoles();

function displeyEmployees();

function addDepartment();

function addRole();

function addEmployee();

function updateEmployee();

init();