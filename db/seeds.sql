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
('Angeal', 'Hewley', 4),
('Professor', 'Hojo', 5);


INSERT INTO employee (first_name, last_name, role_id, reporting_managerID,  manager_id)
VALUES

('Cloud', 'Strife', 1, 1, Null),
('Barret', 'Wallace', 2, 1, Null),
('Aerith', 'Gainsborough', 4, 2, Null), 
('Red', 'XIII', 5, 2, Null),
('Yuffie', 'Kisaragi', 6, 2, Null),
('Zack', 'Fair', 10, 5, Null),
('Sephiroth', 'Hojo', 12, 5, Null),
('Cid', 'Highwind', 9, 3, Null),
('Genesis', 'Rhapsodos', 13, 4, Null),
('Tifa', 'Lockhart', 3, Null, 1) , 
('Cait', 'Sith', 7, NULL, 2),
('Vincent', 'Valentine', 8, null, 3),
('Angeal', 'Hewley', 14, null, 4),
('Professor', 'Hojo', 11, null, 5);


