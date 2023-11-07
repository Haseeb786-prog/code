const express = require('express');
const bodyParser = require('body-parser');
require('./models');
var userctrl = require('./controllers/usercontroller');
const app = express();
app.use(bodyParser.json());

app.get('', (req, res) => {
    res.send("Hello, world!");
});
app.get('/api/add',userctrl.adduser);
app.get('/users',userctrl.getusers);

app.get('/users/:id',userctrl.getuser);
app.post('/users',userctrl.postusers);
app.delete('/users/:id', userctrl.deleteuser);
app.get('/query',userctrl.queryuser);
app.get('/finder',userctrl.finderuser);
app.get('/get',userctrl.getuser);
app.get('/set',userctrl.setuser);
app.get('/validate',userctrl.validateuser);
app.get('/raw',userctrl.rawquery);
app.get('/onetoone',userctrl.one_to_one);
app.get('/onetomany',userctrl.one_to_many);
app.get('/many',userctrl.manytomany);
app.post('/role',userctrl.roles);
app.get('/detail',userctrl.usersdetails);
app.listen(1000, () => {
    console.log('Server is running on port 1000');
});