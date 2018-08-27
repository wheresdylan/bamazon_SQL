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
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var Table = require('cli-table');
        var table = new Table({ head: ["Item ID", "Product", "Department", "Price", "Quantity"] });
         
        for (var i = 0; i < res.length;i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }

        console.log(table.toString());

        itemID();

    })
}

function itemID(){
    inquirer.prompt([
        {
            name:"id",
            message:"Which item would you like to buy (by ID)? "
        }
    ]).then(function(res){
        console.log(res.id);

        var idPicked = parseInt(res.id);

        units(idPicked);
    })
}

function units(idPicked){
    inquirer.prompt([
        {
            name:"units",
            message:"How many units would you like to buy? "
        }
    ]).then(function(res){
        // console.log(res.units);

        var units = parseInt(res.units);

        connection.query("SELECT * FROM products WHERE ?", [{item_id: idPicked}], function(err, res){
            if (err) throw err;
           

            if(units > res[0].stock_quantity){
                console.log("\nInsufficient Quantity\n")
                itemID();
            }else if(units <= res[0].stock_quantity){

                var moneySpent = 0;
                var newSales = 0;
                var newUnits = 0;

                moneySpent = units * res[0].price;
                newSales = moneySpent + res[0].product_sales;
                newUnits = res[0].stock_quantity - units;

                console.log(newSales);

                connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity:newUnits},{item_id: idPicked}], function(err, res){
                    if (err) throw err;

                    // console.log("\nYou spent " + moneySpent + "\n");

                    // console.log("new sales" + newSales);

                    // chooseAgain();

                    // displayProducts();

                    connection.query("UPDATE products SET ? WHERE ?",[{product_sales:newSales},{item_id: idPicked}], function(err, res){
                        if (err) throw err;
    
                        console.log("\nYou spent " + moneySpent + "\n");
    
                        console.log("new sales" + newSales);
    
                        chooseAgain();
    
                        // displayProducts();
                    })
                })

                // connection.query("UPDATE products SET ? WHERE ?",[{product_sales:newSales},{item_id: idPicked}], function(err, res){
                //     if (err) throw err;

                //     console.log("\nYou spent " + moneySpent + "\n");

                //     console.log("new sales" + newSales);

                //     chooseAgain();

                //     // displayProducts();
                // })
            }
        })
    })
}

function chooseAgain(){
    inquirer.prompt([
        {
            name:"again",
            type:"list",
            choices:["yes", "no"],
            message:"Do you want to buy another item? "
        }
    ]).then(function(res){

        if (res.again === "yes"){
            displayProducts();
        }else if(res.again === "no"){
            connection.end();
        }
    })
}

