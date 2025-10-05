const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');

//***********************************GET patient ***********************************************

//To Prevent SQL Injection
const ALLOWED_FILTERS = new Set(["patient_id", "username", "name", "phone_no", "gender", "nic", "email"]);
const ALLOWED_TABLES = new Set(["patient"]); // add views if needed

router.get("/", async(req, res) =>{
  try{
    let table = "patient"; // default view(table)
    if(req.query.view){
      if(ALLOWED_TABLES.has(req.query.view)){
        table = req.query.view;
      }
      else{
        table="";
      }
    }
   
    let sql = `SELECT * FROM ${table} WHERE 1=1`; 
    let params = [];
//-------------Inside a table------------------------------------------
    for(const [key, value] of Object.entries(req.query)){

        if(!ALLOWED_FILTERS.has(key)) continue;

        if(Array.isArray(value)){
          sql += ` AND ${key} IN (${value.map(() => "?").join(",")})`;
          params.push(...value);
        } else if (String(value).includes(",")) {
          const list = value.split(",").map((v) => v.trim());
          sql += ` AND ${key} IN (${list.map(() => "?").join(",")})`;
          params.push(...list);
        }else{
          sql += ` AND ${key} = ?`;
          params.push(value);
        }
      }
    // sql += "ORDER BY patient_id"; if needed

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  }catch(err){
    res.status(500).json({error: err.message});
  }
});

//*****************************************ADD new patient ***********************************************
router.post('/', async (req, res) => {
    const {patient_id, username, name, phone_no, gender, age, nic, email, password} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute("INSERT INTO patient (patient_id, username, name, phone_no, gender, age , nic, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) "
        ,[patient_id, username, name, phone_no, gender, age, nic, email, hashedPassword]);
        res.status(201).json({message: "patient added successfully"});
    } catch (err){
      res.status(500).json({error:err});
    }
});

//******************************************DELETE a patient *****************************************************

router.delete('/:id', async(req, res) => {
  const patient_id = req.params.id;
  
  try{
    await db.execute(`DELETE FROM patient WHERE patient_id=?`,[patient_id]);
    res.status(200).json({message: "patient successfully deleted"});
  }
  catch(err){
    res.status(500).json({error:err});
  }
});



module.exports = router;