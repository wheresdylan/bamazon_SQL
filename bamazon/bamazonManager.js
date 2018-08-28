var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "127.0.0.1",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    menuOptions();

});

function menuOptions() {
    inquirer.prompt([
        {
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "QUIT"],
            name: "choice"
        }
    ]).then(function (res) {
        console.log(res.choice);

        if (res.choice === "View Products for Sale") {
            viewProducts();
        } else if (res.choice === "View Low Inventory") {
            viewLowInventory();
        } else if (res.choice === "Add to Inventory") {
            addToInventory();
        } else if (res.choice === "Add New Product") {
            addNewProduct();
        } else if (res.choice === "QUIT") {
            connection.end();
        }
    })
}

function viewProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var Table = require('cli-table');
        var table = new Table({ head: ["Item ID", "Product", "Department", "Price", "Quantity", "sales"] });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]);
        }

        console.log(table.toString());

        menuOptions();

    })

}

function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var Table = require('cli-table');
        var table = new Table({ head: ["Item ID", "Product", "Department", "Price", "Quantity"] });

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {

                table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);


            }
        }

        console.log(table.toString());

        menuOptions();
    })
}

function addToInventory() {

    var products = [];

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            products.push(res[i].product_name);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "inventory",
                message: "Choose an Item",
                choices: products
            }
        ]).then(function (res) {

            var inventoryChoice = res.inventory;

            inquirer.prompt([
                {
                    name: "amount",
                    message: "How much inventory would you like to add? ",
                }
            ]).then(function (res) {


                var amount = parseInt(res.amount);



                connection.query("SELECT * FROM products WHERE ?", [{ product_name: inventoryChoice }], function (err, res) {
                    if (err) throw err;


                    var newQuantity = res[0].stock_quantity + amount;



                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuantity }, { product_name: inventoryChoice }], function (err) {

                        if (err) throw err;

                        menuOptions();

                    })

                })
            })
        })
    })

}

function addNewProduct() {

    inquirer.prompt([
        {
            name: "product",
            message: "What product would you like to add? "
        }
    ]).then(function (res) {

        var newProduct = res.product;

        var departments = [];

        connection.query("SELECT * FROM departments ", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                departments.push(res[i].department_name);
            }



            inquirer.prompt([
                {
                    type: "list",
                    name: "department",
                    choices: departments,
                    message: "What department would you like to add it to? "
                }
            ]).then(function (res) {

                var department = res.department;

                inquirer.prompt([
                    {
                        name: "price",
                        message: "What is the price? "
                    }
                ]).then(function (res) {

                    var price = parseInt(res.price);

                    inquirer.prompt([
                        {
                            name: "inventory",
                            message: "How much inventory are you adding? "
                        }
                    ]).then(function (res) {

                        var inventory = parseInt(res.inventory);


                        connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales) VALUES ('" + newProduct + "','" + department + "'," + price + "," + inventory + ", 0)", function (err) {

                            if (err) throw err;

                        })

                        menuOptions();


                    })


                })


            })

        })


    })



}