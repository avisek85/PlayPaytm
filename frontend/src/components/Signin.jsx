import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message,setMessage] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;


  const onSignin = async()=>{

    setMessage("Working...");
    if(!username ||!password){
 setMessage("Please enter all fields");
 return;
    }
    if(password.length < 6){
     return setMessage("Password length must be greater than 6");
    }

   try {
    await axios.post(`${apiUrl}/api/v1/user/signin`, {
      username,
      password,
    })
    .then((response) => {
      // console.log(response);
      if (!response.data.token) {
        setMessage("failed to signin")
        console.log("failed to signin");
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        navigate("/");
      }
    });
   } catch (error) {
    setMessage("An error occured while signin.");
    console.log(error);
   }
  }

  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <div className=" m-10 border px-4 py-2 bg-slate-200 rounded">
          <div className="text-3xl font-bold mx-12 my-3">Sign In</div>
          <div>Enter Your information to signin account</div>
          <div className="my-4">
            <label className="font-semibold" htmlFor="">
              Email
            </label>
            <br />
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="border mt-1"
              type="email"
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
            onClick={onSignin}
            className="border bg-blue-500 hover:bg-blue-700  rounded text-white font-bold py-1.5 px-16 "
          >
            Signin
          </button>
          {message && <div className="py-2 text-sm  text-blue-950">{message}</div>}
          <div className="py-2 text-sm flex">
            <div>Don't have an account</div>
            <Link
              className="pointer underline pl-1 font-semibold cursor-pointer"
              to={"/signup"}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;
