//require all the necessary modules to use them;

const bodyParser=require("body-parser");
const express=require("express");
const request=require("request");
const https=require("https");
//create a const app to use the methods of modules;
const app=express();
//using bodyparser encoded we can parse through html docs
app.use(bodyParser.urlencoded({extended: true}));
//We create a public folder and save all our static files such as images folder and css folder which contains file.
app.use(express.static("public"));
//get request made to home route, which sends a html file in response.
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});


//post request made to home route which taps into the data enetred in the text box using req.body.attribute name;
app.post("/", function(req,res){
const firstName=req.body.fName;
const lastName=req.body.lName;
const email=req.body.email;

//create a javascript object to send the data to mailchimp sevrers using their given format
const data= {
  members: [
  {
    email_address: email,
    status:"subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  }
]
};
//convert the javascript data to JSON data
var jsonData=JSON.stringify(data);

//Use the end of api key that is us5 - against usX
//add the list id given to you by the mailchimp at the end of the url
const url=" ";

//When making a http req we use post method and auth to identify the user with api.
const options={
  method:"POST",
  auth: " "
}

//tap into the data sent by the mailchimp server using response.on;
const request=https.request(url,options, function(response){

if(response.statusCode===200){
  res.sendFile(__dirname + "/success.html");
}else{
  res.sendFile(__dirname + "/failure.html");
}
  response.on("data", function(data){
    console.log(JSON.parse(data));
  })

})
//use the request object to write the jsondata into the mail chimp servers
request.write(jsonData);
//after sending the data end the request;
request.end();

})

//if the post request is successfull then after clicking on button it should reroute to home page
app.post("/success", function(req,res){
  res.redirect("/");
})

app.post("/failure", function(req,res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
