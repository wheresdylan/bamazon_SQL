var mysql = require("mysql");
var inquirer = require("inquirer");

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

    menuOptions();


});

function menuOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices: ["View Products by Department", "Create New Department", "QUIT"]

        }
    ]).then(function (res) {

        if (res.choice === "View Products by Department") {

            displayDepartments();

        }else if (res.choice === "Create New Department"){
            createDepartment();
        }else if (res.choice === "QUIT"){
            connection.end();
        }

    })
}

function displayDepartments() {

    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;

        var Table = require('cli-table');
        var table = new Table({ head: ["Department ID", "Department Name", "Over Head Costs", "Department Sales", "Total Profit"] });



        for (var i = 0; i < res.length; i++) {

            var totalProfit = res[i].department_sales - res[i].over_head_costs;

            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].department_sales, totalProfit]);


        }

        console.log(table.toString());

        menuOptions();

    });

}

function createDepartment() {
    inquirer.prompt([
        {
            name: "newDepartment",
            message: "What department would you like to add?"
        }
    ]).then(function (res) {
        var addDepartment = res.newDepartment;

        inquirer.prompt([
            {
                name: "newCost",
                message: "What is the overhead cost?"
            }
        ]).then(function (res) {
            var newCost = res.newCost;

            connection.query("INSERT INTO departments(department_name,over_head_costs, department_sales) VALUES ('" + addDepartment + "'," + newCost + ", 0)", function (err) {

                if (err) throw err;

                menuOptions();

            })


        })

    })
}