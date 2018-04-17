//-----*****-----CONFIG SECTION!-----*****-----//
var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/static'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
//**********===--END OF CONFIG--===**********//


//-----*****-----MONGOOSE/DB SECTION!-----*****-----//
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restfulTaskDB');
mongoose.Promise = global.Promise;

var TaskSchema = new mongoose.Schema({
    title: { type: String },
    desc: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, {timestamps: true})

mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task', TaskSchema);
//-=-=-=-=-=-=-=-=END OF MONGOOSE/DB=-=-=-=-=-=-=-=-=-//


//=====*****=====ROUTING SECTION=====*****=====//
//Route for grabbing ALL tasks in the DB
app.get('/tasks', function(req, res){
    Task.find({}, function(err, results){
        if(err){
            res.json({message: "Error", error: err})
        }else{
            res.json({message: "Success", data: results})
        }
    })
})

//Route for creating a new task in the DB
app.post('/tasks/:id', function(req, res){
    var newTask = new Task(req.body);
    newTask.create(req.body, function(err){
        if(err){
            res.json({message: "Error", error: err});
        }else{
            res.json({message: "Success", data: results})
        }
    })
})

//Route for finding task by id
app.get('/tasks/:id', function(req, res){
    Task.find({_id: req.params.id}, function(err, results){
        if(err){
            res.json({message: "Error", error: err});
        }else{
            res.json({message: "Success", data: results})
        }
    })
})

//Route for updating a task by id (CRUD)
app.put('/tasks/:id', function(req, res) {
    Task.update({ _id: req.params.body }, {$set: {title: req.body.title, description: req.body.description, completed: req.body.completed}}, {multi: false}, function(err, results){
        if (err) {
			console.log('Problem updating..', err);
			res.json({message: 'Error', error: err});
		} else {
			res.json({message:'Success'});
		}
	})
})

//Route for deleting a task
app.delete('/tasks/:id', function(req, res){
    Task.remove({_id: req.params.id}, function(err, results){
        if(err){
            res.json({message: "Error", error: err});
        }else{
            res.json({message: 'Success delete'});
        }
    })
})

//=====*****=====LISTENER SECTION=====*****=====//
app.listen(8000, function(){
    console.log("Listening on port 8000")
});
////=====*****=====END OF LISTENER=====*****=====//

