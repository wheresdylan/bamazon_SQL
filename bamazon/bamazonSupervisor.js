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


});

function menuOptions(){
    inquirer.prompt([
        {
            type:"list",
            name:"choice",
            choices: ["View Products by Department","Create New Department"]
            
        }
    ]).then(function(res){

    })
}

function displayDepartments(){
    
}