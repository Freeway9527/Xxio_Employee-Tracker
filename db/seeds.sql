INSERT INTO department (name) 
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Operations'),
('Marketing');

INSERT INTO role (title, salary, department_id) 
VALUES
('Sales Lead', 80000, 1),
('Salesperson', 70000, 1),
('Sales Manager', 100000, 1),
('Lead Engineer', 130000, 2),
('Full Stack Developer', 80000, 2),
('Software Engineer', 130000, 2),
('Engineer Manager', 130000, 2),
('Accountant', 125000, 3),
('Finanical Analyst', 130000, 3),
('Lead Operations', 120000, 4),
('Operations Manager', 150000, 4),
('Operations Supervisor', 150000, 4),
('Lead Marketing', 100000, 5),
('Marketing Manager', 120000, 5);


INSERT INTO managerEmployee (first_name, last_name, dept_Id)
VALUES
('Tifa', 'Lockhart', 1),
('Cait', 'Sith', 2),
('Vincent', 'Valentine', 3),
('Professor', 'Hojo', 4),
('Angeal', 'Hewley', 5);


INSERT INTO employee (first_name, last_name, role_id, reporting_managerID, manager_id)
VALUES

('Tifa', 'Lockhart', 1, NULL, 1),
('Cait', 'Sith', 2, NULL, 2),
('Vincent', 'Valentine', 3, NULL, 3),
('Professor', 'Hojo', 4, NULL, 4),
('Angeal', 'Hewley', 5, NULL, 5),
('Cloud', 'Strife', 1, 1, NULL),
('Barret', 'Wallace', 2, 1, NULL),
('Aerith', 'Gainsborough', 4, 2, NULL),
('Red', 'XIII', 5, 2, NULL),
('Yuffie', 'Kisaragi', 6, 2, NULL),
('Zack', 'Fair', 10, 10, NULL),
('Sephiroth', 'Hojo', 12, 10, NULL),
('Cid', 'Highwind', 9, 3, NULL),
('Genesis', 'Rhapsodos', 13, NULL);



