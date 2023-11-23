const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const express = require("express");
require("dotenv").config();

// Connect to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    connectionApprove();
  });

// Shows a welcome message when connection is established
connectionApprove = () => {
  console.log("==============================================");
  console.log("==============================================");
  console.log("====                                      ====");
  console.log("====               Welcome                ====");
  console.log("====                                      ====");
  console.log("==============================================");
  console.log("==============================================");
};

// prompts for menu options
const menuPrompts = () => {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "PLEASE SELECT A MENU OPTION...",
      choices: [
        // List of available menu options
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "View Employees By department",
        "View Employees By Manager",
        "Update Employee Role",
        "Add New Employee",
        "Add New Role",
        "Add New Department",
        "Update Employee Managers",
        "Delete Employee",
        "Delete Role",
        "Delete Department",
        "View Total Utilized Budget of a Department",
        "Exit",
      ],
    })
    .then((answers) => {
      const { menu } = answers;
// Perform actions based on selected menu option
      if (menu === "View All Employees") {
        viewAllEmployees();
      }
      if (menu === "View All Roles") {
        viewAllRoles();
      }
      if (menu === "View All Departments") {
        viewAllDepartments();
      }
      if (menu === "View Employees By department") {
        viewEmployeesByDepartment();
      }
      if (menu === "View Employees By Manager") {
        viewEmployeesByManager();
      }
      if (menu === "Update Employee Role") {
        updateEmployeeRole();
      }
      if (menu === "Add New Employee") {
        addNewEmployee();
      }
      if (menu === "Add New Role") {
        addNewRole();
      }
      if (menu === "Add New Department") {
        addNewDepartment();
      }
      if (menu === "Update Employee Managers") {
        updateEmployeeManagers();
      }
      if (menu === "Delete Employee") {
        deleteEmployee();
      }
      if (menu === "Delete Role") {
        deleteRole();
      }
      if (menu === "Delete Department") {
        deleteDepartment();
      }
      if (menu === "View Total Utilized Budget of a Department") {
        viewTotalBudget();
      }
      if (menu === "Exit") {
// Display a logout message and end the connection
        console.log("==============================================");
        console.log("==============================================");
        console.log("=                                            =");
        console.log("=      YOU HAVE SUCCESSFULLY LOGGED OFF      =");
        console.log("=                                            =");
        console.log("==============================================");
        console.log("==============================================");
        connection.end();
      }
    });
};

// Function view all employees
const viewAllEmployees = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table('\n', res);
    menuPrompts();
});
};

// Function view all roles
const viewAllRoles = () => {
  const query = "SELECT * FROM role";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table('\n', res);
    menuPrompts();
});
};

// Function view all departments
const viewAllDepartments = () => {
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table('\n', res);
    menuPrompts();  
});
};

// Function to view employees by department
const viewEmployeesByDepartment = () => {
    const query = `
      SELECT employee.first_name, 
             employee.last_name, 
             department.name AS department
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id
    `; 
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table('\n', res);
      menuPrompts();
  });
};

//function to view employees by manager
const viewEmployeesByManager = () => {
  const query = "SELECT * FROM employee ORDER BY manager_id DESC";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table('\n', res);
  });
  menuPrompts();
};

// Initialize the application 
connection.connect((err) => {
  if (err) throw err;

  menuPrompts();
});
