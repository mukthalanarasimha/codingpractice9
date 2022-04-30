const express = require("express")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const bcrypt = require("bcrypt")

const app = express()
app.use(express.json())

const dataPath = path.join(__dirname,"userData.db")

const initializaDbAndSever = async ()=>{
    try{

        const Db = await open({
            filename:dataPath,
            driver:sqlite3.Database
        });
        app.listen(3000,()=>
        console.log("Server Running at http://localhost:3000"))      
    }catch(error){
        console.log(`ERROR DB ${error.message}`)
        process.exit(1))
    }

}
initializaDbAndSever()

const validPassword = (password) =>{
    return password.length >4
}


//API 1 //
app.post("/register",async (request,response)=>{
    const{username,name,password,gender,location} = request.body
    const hashedPassword = bcrypt.hash(password,10)
    const getUser = `
    SELECT
     * 
     FROM 
     user 
     WHERE username = ${username}`

     const userDetails = await Db.get(getUser)

     if(userDetails === undefined){
         const creatingUser = `
         INSERT INTO user(username,name,password,gender,location)
         VALUES(${username},${name},${hashPassword},${gender},${location})`
         if(validPassword(password)){
        const userCreated = await Db.run(creatingUser)
         response.send(" User sucessFully created")
         }else{
             response.status(400)
         response.send("Password is too short")
         }

         }else{
         response.status(400)
         response.send("User already exit")

     }

})


//API 2 // 
app.post("/login",async(request,response)=>{
    const {username,password} = request.body
     const getUser = `
    SELECT
     * 
     FROM 
     user 
     WHERE username = ${username}`
     const userDetails = await Db.get(getUser)

     If(userDetails === undefined){
         response.status(400)
         response.send("Invalid user")
     }else{
         const comparingPassword = await bcrypt.compare(password,userDetails.password)
         if(comparingPassword === true){
             response.status(200)
             response.send("Login sucess")
         }else{
             response.status(400)
             response.send("Invalid Password")
         }
     }

})

const validatingPassword = (passwordSide)=>{
    return passwordSide < 5
}
// API 3 // 

app.get("/change-password",async(request,response)=>{
    const {username,oldPassword,newPassword} = request.body
     const getUser = `
    SELECT
     * 
     FROM 
     user 
     WHERE username = ${username}`
     const userDetails = await Db.get(getUser)

     if(userDetails === undefined){
         response.send("Invalid user")
     }else{
         const comparingPassword = await bcrypt.compare(oldPassword,userDetails.Password)

         if(comparingPassword === true){
             if(validatingPassword(newPassword)){
                 const hashedPassword = bcrypt.hash(newPassword,10)
                 const updatedPassword = `
                 UPDATE user 
                 SET 
                 Password = ${hashedPassword}
                 WHERE 
                 user = ${username}`

                 
             }else{
                 response.send("password is to short")
             }


         }else{
             response.send("incorrect current password")
         }
         
     }



})

module.exports = app 