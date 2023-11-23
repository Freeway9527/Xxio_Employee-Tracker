const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();
require("console.table");

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
        "Update Employee Managers",
        "Add New Employee",
        "Add New Role",
        "Add New Department",
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
      if (menu === "Update Employee Managers") {
        updateEmployeeManagers();
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

// Function to update employee roles
const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) console.log(err);
      employees = employees.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.empid,
        };
      });
      connection.query("SELECT * FROM role", (err, roles) => {
        if (err) console.log(err);
        roles = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "selectEmployee",
              message: "Which employee would you like to update?",
              choices: employees,
            },
            {
              type: "list",
              name: "selectNewRole",
              message: "What is the employee's new role?",
              choices: roles,
            },
          ])
          .then((data) => {
            connection.query(
              "UPDATE employee SET role_id = ? WHERE empid = ?",
              [data.selectNewRole, data.selectEmployee],
              (err, res) => {
                if (err) console.log(err);
                console.log("Employee role successfully updated!");
                viewEmployeesByDepartment();
              }
            );
          });
      });
    });
  };

// Function to update employee managers
  const updateEmployeeManagers = () => {
    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) console.log(err);
      employees = employees.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.empid,
        };
      });
      connection.query("SELECT * FROM managerEmployee", (err, managers) => {
        if (err) console.log(err);
        managers = managers.map((manager) => {
          console.log(manager.manager_id); //console.log to see data can delete later
          return {
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.manager_id, 
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "selectEmployee",
              message: "Which employee would you like to update?",
              choices: employees,
            },
            {
              type: "list",
              name: "selectManager",
              message: "Who is the employee's new manager?",
              choices: managers,
            },
          ])
          .then((data) => {
          connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                  {
                      reporting_managerID: data.selectManager, 
                  },
                  {   empid: data.selectEmployee
          },
          ],
              function (err) {
                  if (err) throw err;
              }
          );
          console.log("Employee manager has been updated!");
          viewEmployeesByManager();
          });
      });
    });
  };

// Function to add new employee
const addNewEmployee = () => {
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) console.log(err);
      roles = roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      connection.query("SELECT * FROM managerEmployee", (err, managers) => {
          if (err) console.log(err);
          managers = managers.map((manager) => {
            console.log(manager.manager_id); //console.log to see data can delete later
            return {
              name: `${manager.first_name} ${manager.last_name}`,
              value: manager.manager_id, //manager.reporting_managerID
            };
          });
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "What is the employee's first name?",
              validate: (firstNameInput) => {
                if (firstNameInput) {
                  return true;
                } else {
                  console.log("Please enter employee's first name!");
                  return false;
                }
              },
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?",
              validate: (lastNameInput) => {
                if (lastNameInput) {
                  return true;
                } else {
                  console.log("Please enter employee's last name!");
                  return false;
                }
              },
            },
            {
              type: "list",
              name: "selectRole",
              message: "What is the employee's role?",
              choices: roles,
            },
            {
              type: "list",
              name: "selectManagerId",
              message: "Who is the employee's manager?",
              choices: managers,
            },
          ])
          .then((data) => {
            console.log(data);
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: data.firstName,
                last_name: data.lastName,
                role_id: data.selectRole,
                reporting_managerID: data.selectManagerId,
              },
              (err) => {
                if (err) throw err;
                console.log("Employee has been added!\n");
                viewAllEmployees();
              }
            );
          });
      });
    });
  };
  
  // Function to add new role
  const addNewRole = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
      if (err) console.log(err);
      departments = departments.map((department) => {
        return {
          name: department.name,
          value: department.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            name: "roleTitle",
            message: "What is the role's title?",
            validate: (roleTitleInput) => {
              if (roleTitleInput) {
                return true;
              } else {
                console.log("Please enter role's title!");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "salary",
            message: "What is the role's salary?",
            validate: (salaryInput) => {
              if (salaryInput) {
                return true;
              } else {
                console.log("Please enter role's salary!");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "selectDepartment",
            message: "What is the role's department?",
            choices: departments,
          },
        ])
        .then((data) => {
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: data.roleTitle,
              salary: data.salary,
              department_id: data.selectDepartment,
            },
            function (err) {
              if (err) throw err;
            }
          );
          console.log("New Role has been added!");
          viewAllRoles();
        });
    });
  };
  
  // Function to add new department
  const addNewDepartment = () => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "What is the department's name?",
          validate: (departmentNameInput) => {
            if (departmentNameInput) {
              return true;
            } else {
              console.log("Please enter department's name!");
              return false;
            }
          },
        },
      ])
      .then((data) => {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: data.departmentName,
          },
          function (err) {
            if (err) throw err;
          }
        );
        console.log("New Department has been added!");
        viewAllDepartments();
      });
  };
  
  // Function to delete employee
  const deleteEmployee = () => {
      connection.query("SELECT * FROM employee", (err, employees) => {
        if (err) console.log(err);
        employees = employees.map((employee) => {
          return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.empid,
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "deleteEmployee",
              message: "Which employee would you like to delete?",
              choices: employees,
            },
            {
                type: "confirm",
                name: "confirmation",
                message: "Are you sure you want to delete this employee?",
                default: false, // Default answer is "No"
              },
          ])
          .then((data) => {
            connection.query(
              "DELETE FROM employee WHERE empid = ?",
              [data.deleteEmployee],
              (err) => {
                if (err) throw err;
                console.log("Employee has been successfully deleted!");
                viewAllEmployees(); 
              }
            );
          });
      });
    };
  
// Function to delete role
    const deleteRole = () => {
      connection.query("SELECT * FROM role", (err, roles) => {
        if (err) console.log(err);
        roles = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "deleteRole",
              message: "Which role would you like to delete?",
              choices: roles,
            },
            {
                type: "confirm",
                name: "confirmation",
                message: "Are you sure you want to delete this role?",
                default: false, // Default answer is "No"
              },
          ])
          .then((data) => {
            connection.query(
              "DELETE FROM role WHERE id = ?",
              [data.deleteRole],
              (err) => {
                if (err) throw err;
                console.log("Role has been successfully deleted!");
                viewAllRoles(); 
              }
            );
          });
      });
    }
  
// Function to delete department
    const deleteDepartment = () => {
      connection.query("SELECT * FROM department", (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((department) => {
          return {
            name: department.name,
            value: department.id,
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "deleteDepartment",
              message: "Which department would you like to delete?",
              choices: departments,
            },
            {
                type: "confirm",
                name: "confirmation",
                message: "Are you sure you want to delete this department?",
                default: false, // Default answer is "No"
              },
          ])
          .then((data) => {
            connection.query(
              "DELETE FROM department WHERE id = ?",
              [data.deleteDepartment],
              (err) => {
                if (err) throw err;
                console.log("Department has been successfully deleted!");
                viewAllDepartments(); 
              }
            );
          });
      });
    }

    // Function to view total utilized budget of a department
    const viewTotalBudget = () => {
      connection.query("SELECT * FROM department", (err, departments) => {
        if (err) console.log(err);
        departments = departments.map((department) => {
          return {
            name: department.name,
            value: department.id,
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "selectDepartment",
              message: "Which department would you like to view?",
              choices: departments,
            },
          ])
          .then((data) => {
            connection.query(
              "SELECT SUM(salary) FROM role WHERE department_id = ?",
              [data.selectDepartment],
              (err, res) => {
                if (err) throw err;
                console.log(res);
                menuPrompts();
              }
            );
          });
      });
    }

// Initialize the application 
connection.connect((err) => {
  if (err) throw err;

  menuPrompts();
});
