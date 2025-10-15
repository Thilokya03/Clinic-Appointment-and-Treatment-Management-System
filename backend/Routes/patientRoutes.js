const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error } = require("console");
const {authenticate, patientAuth} = require('../middlewares/auth');

const SECRET_KEY = process.env.JWT_SECRET;

//**********************************SIGNUP********************************************* */

router.post('/signup', async (req, res) => { // TEST PASSSS
    const {patient_id, username, name, phone_no, gender, age, nic, email, password} = req.body;

    if(!username||!password||!email){
      return res.status(400).json({errro: "Please provide username, email and password"});
    }
    try{
      const [existingUser] = await db.execute(
        `SELECT * FROM patient WHERE username = ? OR email = ?`, [username, email]
      );

      if(existingUser.length > 0){
        return res.status(400).json({error: "Username or email already in use"});
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.execute("INSERT INTO patient (patient_id, username, name, phone_no, gender, age , nic, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) "
        ,[patient_id, username, name, phone_no, gender, age, nic, email, hashedPassword]);
        res.status(201).json({message: "patient added successfully"});
    } catch (err){
      res.status(500).json({error:err});
    }
});

//******************************************SIGNIN******************************************** */

router.post('/signin', async(req, res) => { //TEST PASS
  const {username, password} = req.body;

  if (!username||!password){
    return res.status(400).json({error:"please provide username or password"});
  }
  try{
    // Find user by username
    const [rows] = await db.execute(`SELECT * FROM patient WHERE username = ?`, [username]);

    if(rows.length === 0){
      return res.status(401).json({error:"Invalid credentials"});
    }

    const patient = rows[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, patient.password);

    if(!isMatch){
      return res.status(401).json({error:"Invalid credentials"});
    }
    //create payload
    const payload = {
      user:{
        id:patient.patient_id,
        username:patient.username,
        role:"patient"
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
            id:patient.patient_id,
            username: patient.username,
            name: patient.name,
            email:patient.email
          }
        });
      }
    )

    }catch(err){
      console.error(err);
      res.status(500).json({ error: "Server error during login" });
    }
  



});


//******************************************DELETE a patient *****************************************************

router.delete('/delete', authenticate, async(req, res) => {
  const patient_id = req.user.id;
  
  // if (req.user.id !== patient_id) {
  //   return res.status(403).json({error: 'Not authorized to delete this account'});
  // }
  try{
    await db.execute(`DELETE FROM patient WHERE patient_id=?`,[patient_id]);
    res.status(200).json({message: "patient successfully deleted"});
  }
  catch(err){
    res.status(500).json({error:"Server error while deleting the account"});
  }
});

// **********************************************GET a patient*****************************

router.get('/', authenticate, async(req, res) => { // TEST PASS
  const patient_id = req.user.id;
  try {
    const [rows] = await db.execute(
      'SELECT patient_id, username, name, phone_no, gender, age, nic, email FROM patient WHERE patient_id = ?',
      [patient_id]
    );
    console.log("rows", rows);
    
    if (rows.length === 0) {
      return res.status(404).json({error: 'Patient not found'});
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});
module.exports = router;