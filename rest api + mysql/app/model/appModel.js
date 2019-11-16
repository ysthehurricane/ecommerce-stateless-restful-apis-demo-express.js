'user strict';
var sql = require('./db.js');

//Task object constructor

var Task = function(task){

    this.task = task.task;
    this.status = task.status;
    this.created_at = new Date();

};

Task.createTask = function createUser(newTask, result) {    
    sql.query("INSERT INTO tasks set ?", newTask, function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                console.log(res.insertId);
                result(null, res.insertId);
            }
        });           
};

module.exports= Task;
