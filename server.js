const express = require('express');
const cors = require('cors');
const app = express();
const port=3000;
const data= require('./quiz4.json');
//app.use('/',express.static('public'));
app.use(cors());
const budget = {
    myBudget: [
{
    title: 'Eat out',
    budget: 25
},
{
    title: 'Rent',
    budget: 375
},
{
  "title": "Grocery",
  "budget": 80
}   
]};

 app.use('/budget',(req,res) => {
   res.json(data);
 });
// app.get('/budget', (req, res) => {
//     res.json(budget);
// });
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});

