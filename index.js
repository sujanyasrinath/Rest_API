const express = require('express');
const app = express();
const port = 3200;
const cors = require('cors');
app.use(cors());

app.use(express.json());

const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }
//Step 4 - Get the full list of users
 app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job!= undefined){
        let result = findUserByNameAndJob(name,job);
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined){
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }

    else{
        res.send(users);
    }
});

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

const findUserByNameAndJob = (name,job) => { 
    return users['users_list'].find(((user) => user['name'] === name) && ((user) => user['job'] === job)); 
}

//Get User by specific ID

app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    let newUser = addUser(userToAdd);
    let result = {user:newUser}
    res.status(201).send(result);
});

function addUser(user){
    if(user['id'] == undefined){
        newId = Math.floor((1+Math.random())* 0x100000).toString(16);
        while (findUserById(newId) != undefined){
            newId = Math.floor((1+Math.random())* 0x100000).toString(16);
        }
        user['id'] = newId;
    }
    users['users_list'].push(user);
    return user;
}

app.delete('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = deleteUserById(id);
    if (result)
        res.status(404).send('Resource not found.');
    else {
        res.status(204).end();
    }
});

function deleteUserById(id){
    const len = users['users_list'].length;
    users['users_list'] = users['users_list'].filter( (user) => user['id'] !== id);
    return len === users['users_list'].length;
}





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); 

