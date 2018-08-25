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

function menuOptions(){
    inquirer.prompt([
        {
            type:"list",
            choices:["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name:"choice"
        }
    ]).then(function(res){
        console.log(res.choice);

        if (res.choice === "View Products for Sale"){
            viewProducts();
        }else if (res.choice === "View Low Inventory"){
            viewLowInventory();
        }
    })
}

function viewProducts(){

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var Table = require('cli-table');
        var table = new Table({ head: ["Item ID", "Product", "Department", "Price", "Quantity"] });
         
        for (var i = 0; i < res.length;i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }

        console.log(table.toString());

        menuOptions();

    })

}

function viewLowInventory(){
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        console.log(res);

            for (var i = 0; i < res.length; i++){
                if(res[i].stock_quantity < 5 ){
                    
                }
            }
    })
}