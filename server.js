const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const e = require("express");
require("dotenv").config();
require("console.table");

// Connect to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
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

// Prompts for menu options
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
      // Perform action based on menu option selected
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
        // Display a log off message and end the connection
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
  const query = `
    SELECT
        e.empid AS ID,
        e.first_name AS First_Name,
        e.last_name AS Last_Name,
        r.title AS role,
        d.name AS Department,
        r.salary AS Salary,
    CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employee AS e
    LEFT JOIN ROLE r ON e.role_id = r.Id
    JOIN  department d ON r.department_id = d.Id
    LEFT JOIN managerEmployee m ON e.reporting_ManagerID = m.manager_id
    `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      connection.end(); 
      return;
    }
    console.table("\n", results); 
    menuPrompts(); 
  });
};

// Function view all roles
const viewAllRoles = () => {
  const query = "SELECT * FROM role";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table("\n", res);
    menuPrompts();
  });
};

// Function to view all departments
const viewAllDepartments = () => {
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table("\n", res);
    menuPrompts();
  });
};

// Function to view all employees by department
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
    console.table("\n", res);
    menuPrompts();
  });
};

// Function to view all employees by manager
const viewEmployeesByManager = () => {
    connection.query("SELECT * FROM managerEmployee", (err, managers) => {
      if (err) console.log(err);
      managers = managers.map((manager) => {
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.manager_id,
        };
      });

      // Add an Exit option to the list of managers to return to the main menu
      const exitOption = { name: "Exit", value: null };
      managers.push(exitOption);
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "selectManager",
            message: "Which manager's employees would you like to view?",
            choices: managers,
          },
        ])
        .then((data) => {
          const managerId = data.selectManager;

            // Exit button to function
            if (managerId === null) {
                menuPrompts();
                return;
            }

          const query = `
            SELECT 
              e.first_name AS First_Name,
              e.last_name AS Last_Name,
              r.title AS Role
            FROM 
              employee e
            LEFT JOIN 
              role r ON e.role_id = r.id
            LEFT JOIN 
              department d ON r.department_id = d.id
            WHERE 
              e.reporting_managerID = ?; -- Filter by manager ID
          `;
          connection.query(query, [managerId], (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              return;
            }
            console.table('\n', results); 
            viewEmployeesByManager();
          });
        });
    });
  };
  

// Function to update employee role
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

// Fuction to update employee manager
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
              { empid: data.selectEmployee },
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
        return {
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.manager_id,
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
          // Default answer is set to "No"
          default: false,
        },
      ])
      .then((data) => {
        if (data.confirmation === true) {
          connection.query(
            "DELETE FROM employee WHERE empid = ?",
            [data.deleteEmployee],
            (err) => {
              if (err) throw err;
              console.log("Employee has been successfully deleted!");
              viewAllEmployees();
            }
          );
        } else {
          console.log("Deletion canceled.");
          viewAllEmployees();
        }
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
          // Default answer is set to "No"
          default: false,
        },
      ])
      .then((data) => {
        // Check to see if user confirmed deletion
        if (data.confirmation === true) {
          connection.query(
            "DELETE FROM role WHERE id = ?",
            [data.deleteRole],
            (err) => {
              if (err) throw err;
              console.log("Role has been successfully deleted!");
              viewAllRoles();
            }
          );
        } else {
          console.log("Deletion canceled.");
          viewAllRoles();
        }
      });
  });
};

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
          // Default answer is "No"
          default: false,
        },
      ])
      .then((data) => {
        // Check to see if user confirmed deletion
        if (data.confirmation === true) {
          connection.query(
            "DELETE FROM department WHERE id = ?",
            [data.deleteDepartment],
            (err) => {
              if (err) throw err;
              console.log("Department has been successfully deleted!");
              viewAllDepartments();
            }
          );
        } else {
          console.log("Deletion canceled.");
          viewAllDepartments();
        }
      });
  });
};

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
};

// Initializee the application
connection.connect((err) => {
  if (err) throw err;

  menuPrompts();
});
