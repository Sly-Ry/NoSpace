-- department table
INSERT INTO departments (name)
VALUES
    ('Monster Hunting'),
    ('Jedi Council'),
    ('HR');

-- role table
INSERT INTO roles (title, salary, department_id)
VALUES
    ('Lead Hunter', 20.00, 1),
    ('Hunter', 10.00, 1),
    ('Jedi Knight', 40.00, 2),
    ('Padawan', 2.00, 2),
    ('Administrator', 100.00, 3),
    ('Intern', 5.00, 3);

-- employee table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Rhoda', 'Broughton', 1, NULL),
    ('Hart', 'Crane', 3, NULL),
    ('Vitorio', 'DeSica', 2, 1),
    ('Wilkie', 'Collins', 2, 1),
    ('Elizabeth', 'Gaskell', 4, 2),
    ('Sydney', 'Owenson', 3, NULL),
    ('Hubert', 'Crackanthorpe', 5, NULL),
    ('William', 'Carleton', 6, 7);