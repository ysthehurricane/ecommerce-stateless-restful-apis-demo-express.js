'use strict';
var Task = require('../model/appModel.js');

exports.create_a_task = function(req, res) {
    var new_task = new Task(req.body);
  
    //handles null error 
     if(!new_task.task || !new_task.status){
  
              res.status(400).send({ error:true, message: 'Please provide task/status' });
  
          }
  else{
    
    Task.createTask(new_task, function(err, task) {
      
      if(err)
      {
        res.send(err);
        res.json(task);
      }

    });
  }
  
  };