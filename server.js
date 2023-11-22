const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const chalk = require('chalk');

// Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'employee_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    connectionApprove();
});
//shows a welcome message when connection is established
connectionApprove = () => {
    console.log("==============================================");
    console.log("==============================================");
    console.log("====                                      ====");
    console.log("====               Welcome                ====");
    console.log("====                                      ====");
    console.log("==============================================");
    console.log("==============================================");
    menuPrompts();
};

// prompts for menu options
const menuPrompts = () => {
    inquirer
        .prompt({
            name: 'menu',
            type: 'list',
            message: 'PLEASE SELECT A MENU OPTION...',
            choices: [
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'View Employees By department',
                'View Employees By Manager',
                'Update Employee Role',
                'Add New Employee',
                'Add New Role',
                'Add New Department',
                chalk.red('Update Employee Managers'),
                chalk.red('Delete Employee'),
                chalk.red('Delete Role'),
                chalk.red('Delete Department'),
                chalk.blue("View Total Utilized Budget of a Department"),
                'Exit',
            ],
        })
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View All Employees') {
                viewAllEmployees();
            }
            if (choices === 'View All Roles') {
                viewAllRoles();
            }
            if (choices === 'View All Departments') {
                viewAllDepartments();
            }
            if (choices === 'View Employees By department') {
                viewEmployeesByManager();
            }
            if (choices === 'View Employees By Manager') {
                viewEmployeesByManager();
            }
            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }

            if (choices === 'Add New Employee') {
                addNewEmployee();
            }
            if (choices === 'Add New Role') {
                addNewRole();
            }
            if (choices === 'Add New Department') {
                addNewDepartment();
            }
            if (choices === 'Update Employee Managers') {
                updateEmployeeManagers();
            }
            if (choices === 'Delete Employee') {
                deleteEmployee();
            }
            if (choices === 'Delete Role') {
                deleteRole();
            }
            if (choices === 'Delete Department') {
                deleteDepartment();
            }
            if (choices === 'View Total Utilized Budget of a Department') {
                viewTotalBudget();
            }
            if (choices === 'Exit') {
                console.log('You have Logged out!')
                connection.end();
            }

        });

};
