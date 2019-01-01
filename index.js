const express = require('express');
var mysql = require('mysql')
var cors = require('cors')
const app = express();
const get = require('./db_conn')
var data={
    message:"data on"
}
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.get("/api",(req,res)=>{res.send(data)});
var image=[];
app.get("/getAll",(req,res)=>{
    get.query("SELECT * FROM mobile", function (err, result) {
        if (err) throw err;
        // image=result[0].images.split(",")
        res.send(result)
      });
})

app.get("/version",(req,res)=>{
    get.query('SELECT * FROM `os` where name='+mysql.escape(req.query.os),function(err,result){
        if(err) throw err;
        res.send(result)
    })
})
app.post("/add",(req,res)=>{
    console.log(req.body)
    get.query("INSERT INTO mobile (`name`,`manufacturer`,`os`,`version`,`battery`,`weight`,`ram`,`internal`,`expandable`,`width`,`depth`,`height`,`stock`,`price`,`images`) VALUES ('"+req.body.name+"','"+req.body.manufacturer+"','"+req.body.os+"','"+req.body.version+"','"+req.body.battery+"','"+req.body.weight+"','"+req.body.ram+"','"+req.body.internal+"','"+req.body.expandable+"','"+req.body.width+"','"+req.body.depth+"','"+req.body.height+"','"+req.body.stock+"','"+req.body.price+"','"+req.body.file+"')",function(err,result){
        if(err) throw err;
        console.log("1 record inserted, ID: " + result.insertId);
    })
    res.send(req.body.file)
})

app.put("/update",(req,res)=>{
    get.query("UPDATE mobile set name = ? , manufacturer = ? , os = ? , version = ? , battery = ? , weight = ? , ram = ? , internal = ? , expandable = ? , width = ? , depth = ? , height = ? , stock = ? , price = ?  where mobile_id=?",[req.body.name , req.body.manufacturer , req.body.os , req.body.version , req.body.battery , req.body.weight , req.body.ram , req.body.internal,req.body.expandable,req.body.width,req.body.depth,req.body.height,req.body.stock,req.body.price,req.body.mobile_id],function(error,result,fields){
        if (error) {
            console.log("error", error);
          }
    })
})

app.delete("/deleteMobile",(req,res)=>{
    get.query("DELETE FROM mobile where mobile_id = ?",[req.query.id],function(err,result){
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    })
})

app.get("/viewMobile",(req,res)=>{
    get.query("SELECT * FROM `mobile` where mobile_id=?",[req.query.id],function(err,result){
        if(err) throw err;
        res.send(result);
    });
})

app.get("/addToCart",(req,res)=>{
    get.query("INSERT into cart (`mobile_id`,`qty`)values(?,?)",[req.query.id,1],function(err,result){
        if(err)
        {
            get.query("UPDATE `cart` set `incart`=? where mobile_id=?",[1,req.query.id],function(err,result){
            })
        }
        get.query("SELECT *  from `cart` where `incart`=1",function(err,result){
            res.send(result)
            // res.render("/buy")``
        })
    })
})

app.get("/getCart",(req,res)=>{
    get.query("SELECT * from cart where `incart`=1",function(err,result){
        if(err) throw err;
        res.send(result);
    })
})

app.get("/getCartMobile",(req,res)=>{
    get.query("SELECT `mobile_id` from cart where `incart`=1",function(err,result){
        if (err) throw err;
        console.log(result)
        var id=result.map(function(cart){return cart.mobile_id})
        console.log(id)
        
        let queryParam = "("+id.join()+")"

        get.query("SELECT * from mobile where mobile_id IN "+queryParam,function(cartErr,cartResult){
            res.send(cartResult)
        })
    })
})
app.get("/deleteMobile",(req,res)=>{
    console.log(req.query.id);
    get.query("UPDATE cart set `incart`=? where `mobile_id`=?",[0,req.query.id],function(err,result){
        res.send(result);
    })
})

app.get("/images",(req,res)=>{
    get.query("SELECT images from mobile where `mobile_id`=25",function(err,result){
        res.send(result);
    })
})

app.listen(5000);