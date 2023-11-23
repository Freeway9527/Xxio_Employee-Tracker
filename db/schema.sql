DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY ,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY ,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_deparment FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

create table managerEmployee (
  manager_id INT NOT NULL auto_increment primary key,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  dept_id INT NOT NULL,
  FOREIGN KEY (dept_id) references department(id)
  );


CREATE TABLE employee (
  empid INT AUTO_INCREMENT PRIMARY KEY ,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  reporting_managerID INT,
  manager_id INT,
  INDEX manager_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES managerEmployee(manager_id) ON DELETE SET NULL
);

