DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;


CREATE TABLE products(
 item_id INT AUTO_INCREMENT,
 product_name VARCHAR(100) NULL,
 department_name VARCHAR(100) NULL,
 price INT NULL,
 stock_quantity INT NULL,
 product_sales INT NULL,
 PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES ("playstation 5", "Electronics", 600, 96,0),
("XBOX One Half", "Electronics", 675, 110,0),
("Ray Gun", "Sports", 750, 85,0),
("Light Saber", "Sports", 265, 23,0),
("Green Pepper Oarnges", "Produce", 4, 205,0),
("Harry Potter's Invisible Cloak", "Apparel", 2000, 11,0),
("Kitten Mittens", "Toys", 12, 225,0),
("Aguivida(immortality water)", "Grocery", 45, 96,0),
("Hover Board", "Sports", 180, 120,0),
("Radioactive Lolipop", "Appliances", 26, 45,0),
("Self Walking Dog Leash", "Pets", 55, 32,0);


CREATE TABLE departments(
 department_id INT AUTO_INCREMENT,
 department_name VARCHAR(100) NULL,
 over_head_costs INT NULL,
 department_sales INT NULL,
 PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name,over_head_costs, department_sales)
VALUES ("Electronics", 20000, 0),
("Sports", 15000, 0),
("Produce", 11000, 0),
("Apparel", 18000, 0),
("Toys", 14000, 0),
("Grocery", 9000, 0),
("Appliances", 13000, 0),
("Pets", 22000, 0);








