import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [firstName, setFirstName] = useState("john");
  const [lastName, setLastName] = useState("Doe");
  const [username, setUsername] = useState("myemail@.com");
  const [password, setPassword] = useState("");
  const [message,setMessage] = useState("");
  const navigate = useNavigate();

  async function onsignup() {
    setMessage("Working...");
   if(!username || !firstName || !lastName || !password){
setMessage("Please enter all fields");
return;
   }
   if(password.length < 6){
    return setMessage("Password length must be greater than 6");
   }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          username,
          firstName,
          lastName,
          password,
        }
      );
      if(response.data.message){
        setMessage(response.data.message);
      }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (error) {
      setMessage("Error while signup");
      console.log("Error while signup", error);
    }
    // localStorage.removeItem("token")
  }
  return (
    <>
      <div className="flex flex-col items-center space-y-2 border">
        <div className=" m-10 border px-4 py-2 bg-slate-200 rounded">
          <div className="text-3xl font-bold mx-12 my-3">Sign Up</div>
          <div>Enter Your information to create an account</div>
          <div className="my-4">
            <label className="font-semibold" htmlFor="">
              First Name
            </label>
            <br />
            <input
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="border mt-1"
              type="text"
              placeholder="John"
            />
          </div>
          <div className="my-4">
            <label className="font-semibold" htmlFor="">
              Last Name
            </label>
            <br />
            <input
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="border mt-1"
              type="text"
              placeholder="doe"
            />
          </div>
          <div className="my-4">
            <label className="font-semibold" htmlFor="">
              Email
            </label>
            <br />
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="border -mt-1"
              type="text"
              placeholder="xyz@gmail.com"
            />
          </div>
          <div className="my-4">
            <label className="font-semibold" htmlFor="">
              Password
            </label>
            <br />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="border mt-1"
              type="text"
            />
          </div>
          <button
            onClick={() => onsignup()}
            className="border bg-blue-500 hover:bg-blue-700  rounded text-white font-bold py-1.5 px-16 mt-1"
          >
            Signup
          </button>
          {message && <div className="py-2 text-sm  text-blue-950">{message} </div>}

          <div className="py-2 text-sm flex">
            <div>Already have an account</div>
            <Link
              className="pointer underline pl-1 cursor-pointer font-semibold"
              to={"/signin"}
            >
              Signin
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
