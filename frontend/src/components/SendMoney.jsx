import React, { useState } from 'react'
import {useSearchParams} from "react-router-dom"
import axios from "axios"
import {useNavigate} from "react-router-dom"

function SendMoney() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const lastName = searchParams.get("lastName");
  const balance = searchParams.get("balance");
  // console.log("balance is ",balance);
  const [amount,setAmount] = useState(0);
  const navigate = useNavigate();
  const [message , setMessage] = useState("");

  const onSendMoney = async()=>{
    // console.log("amount and balance is ",amount,balance);
    if(isNaN(Number(amount))){
      return setMessage("Please enter a valid amount");
    }
    if(Number(amount) > Number(balance)){
      return setMessage("Balance is not enough.")
    }
   await axios.post("http://localhost:3000/api/v1/account/transfer",{
      to:id,
      amount,
    },{
      headers:{
        Authorization:"Bearer "+localStorage.getItem("token")
      }
    })
    navigate("/");
  }

  return (
    <div className="flex justify-center">
      <div className=" m-10 border py-2 px-1 bg-slate-200 rounded">
          <div className="text-3xl font-bold mx-3 my-1">Send Money</div>
          <div className="flex text-lg font-bold mx-3 mt-10 mb-4">
            <div className="rounded-full h-7 w-7 bg-green-600  mt-1 mr-2 px-2">{name[0].toUpperCase()}</div>
            <div className="mt-1">{name} {lastName}</div>
          </div>
          <div className="mx-3">Amount (in Rs)</div>
          <div><input onChange={(e)=>{
            setAmount(e.target.value)
          }} className="border border-gray-300  focus:outline-none px-3 py-2 mx-2 mb-3 rounded-md " type="text" placeholder='Search users...' />
</div>
          <button onClick={()=>{onSendMoney()}} className="border bg-blue-500 hover:bg-blue-700  rounded text-white font-bold py-1.5  px-[85px] my-1 mx-2">Send</button>
          
             {message && <div className="p-2 text-sm  text-blue-950">{message}</div>}

      </div>   
      
    </div>
  )
}

export default SendMoney