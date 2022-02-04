const inquirer = require('inquirer');

const questions = [
    {
        type: 'list',
        name: 'query',
        message: 'What would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
    }
];

function init() {
    inquirer.prompt(questions)
}

init();