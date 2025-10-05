const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const { message } = require("statuses");


//********************************* GET staff ***********************************

//To Prevent SQL Injection 
const ALLOWED_FILTERS = new Set(["staff_id", "username", "name", "category", "phone_no", "gender", "nic", "email", "branch_id"]);
const ALLOWED_TABLES = new Set(["staff"]); // add views if needed

router.get("/", async(req, res) =>{
  try{
    let table = "staff"; // default view(table)
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

//**************************ADD staff **********************************************

router.post('/', async (req, res) => {
    const {staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute("INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
        ,[staff_id, username, name, category, phone_no, gender, nic, email, hashedPassword, branch_id]);
        res.status(201).json({message: "Staff added successfully"});
    } catch (err){
      res.status(500).json({error:err});
    }
});

//**************************DELETE a patient******************************************

router.delete('/:id', async(req, res) => {
  const staff_id = req.params.id;
  
  try{
    await db.execute(`DELETE FROM staff WHERE staff_id=?`,[staff_id]);
    res.status(200).json({message: "Staff successfully deleted"});
  }
  catch(err){
    res.status(500).json({error:err});
  }
});
//-------------------------------------------------------------------------
// router.get('/', async (req, res) => {
//   try {
//     const [staffs] = await db.execute('SELECT * FROM staff');
//     res.json(staffs);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// });

// router.get('/:staff_id', async(req, res) => {
//   const {staff_id} = req.params;
//   try{
//     const [theStaff] = await db.execute("SELECT * FROM staff WHERE staff_id = ? ",[staff_id]);
//     res.json(theStaff);
//   }catch (err){
//     res.status(500).json({error:err})
//   }
// });
//--------------------------------------------------------------------------

module.exports = router;