const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'YusriIsAnEngineer';
const { authenticate, staffAuth } = require('../middlewares/auth');
// const { message } = require("statuses");


//********************************* GET staff ***********************************

//To Prevent SQL Injection 
const ALLOWED_FILTERS = new Set(["staff_id", "username", "name", "category", "phone_no", "gender", "nic", "email", "branch_id"]);
const ALLOWED_TABLES = new Set(["staff"]); // add views if needed

router.get("/",staffAuth([]), async(req, res) =>{
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
    // sql += "ORDER BY staff_id"; if needed

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  }catch(err){
    res.status(500).json({error: err.message});
  }
});

//**************************ADD staff **********************************************

// router.post('/', async (req, res) => {
//     const {staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id} = req.body;

//     try{
//         const hashedPassword = await bcrypt.hash(password, 10);

//         await db.execute("INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
//         ,[staff_id, username, name, category, phone_no, gender, nic, email, hashedPassword, branch_id]);
//         res.status(201).json({message: "Staff added successfully"});
//     } catch (err){
//       res.status(500).json({error:err});
//     }
// });

//**********************************SIGNUP********************************************* */

router.post('/signUp', async (req, res) => {
    const {staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id} = req.body;
    if(!username||!password||!email){
      return res.status(400).json({errro: "Please provide username, email and password"});
    }
    try{
      const [existingUser] = await db.execute(
        `SELECT * FROM staff WHERE username = ? OR email = ?`, [username, email]
      );

      if(existingUser.length > 0){
        return res.status(400).json({error: "Username or email already in use"});
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.execute(`INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [staff_id, username, name, category, phone_no, gender, nic, email, hashedPassword, branch_id]);
        res.status(201).json({message: "staff added successfully"});
    } catch (err){
      res.status(500).json({error:err});
    }
});

//**************************SIGN IN*********************************************** */
router.post('/signIn', async(req, res) => {
  const {username, password} = req.body;

  if (!username||!password){
    return res.status(400).json({error:"please provide username or password"});
  }
  try{
    // Find user by username
    const [rows] = await db.execute(`SELECT * FROM staff WHERE username = ?`, [username]);

    if(rows.length === 0){
      return res.status(401).json({error:"Invalid credentials"});
    }

    const staff = rows[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, staff.password);

    if(!isMatch){
      return res.status(401).json({error:"Invalid credentials"});
    }
    //create payload
    const payload = {
      user:{
        id:staff.staff_id,
        username:staff.username,
        role:"staff"
      }
    };

    //Generate token
    jwt.sign(
      payload,
      SECRET_KEY,
      {expiresIn: '6h'},
      (err, token) => {
        if(err) throw err;
        res.json({
          message: "Login Successfull",
          token,
          user: {
            id:staff.staff_id,
            username: staff.username,
            name: staff.name,
            email:staff.email
          }
        });
      }
    )

    }catch(err){
      console.error(err);
      res.status(500).json({ error: "Server error during login" });
    }
  



});

//**************************DELETE a staff******************************************

router.delete('/', staffAuth(['admin']), async(req, res) => {
  const staff_id = req.user.id;
  
  try{
    await db.execute(`DELETE FROM staff WHERE staff_id=?`,[staff_id]);
    res.status(200).json({message: "Staff successfully deleted"});
  }
  catch(err){
    res.status(500).json({error:err});
  }
});

module.exports = router;