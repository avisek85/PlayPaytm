import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [id, setId] = useState("");
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log("API URL in dashboard:", apiUrl);


  useEffect(() => {
    if (!localStorage.getItem(`token`)) {
      navigate("/signin");
    }
  }, []);

  const fetchFilterUser = async (filter) => {
    await axios
      .get(`${apiUrl}/api/v1/user/bulk?filter=` + filter)
      .then((response) => {
        setUsers(response.data.user);
      });
  };

  useEffect(() => {
    if (filter) {
      fetchFilterUser(filter);
    }
  }, [filter]);

  const fetchCurrentUser = async () => {
    await axios
      .post(`${apiUrl}/api/v1/user/me`, {
        userId: localStorage.getItem("userId"),
      })
      .then((response) => {
        setFirstName(response.data.me.firstName.toUpperCase());
        setLastName(response.data.me.lastName.toUpperCase());
        setId(response.data.me._id);
        // console.log(response);
      });
  };

  useEffect(() => {
    // console.log("userId stored is ",localStorage.getItem("userId"));
    fetchCurrentUser();
  }, []);

  const fetchBalance = async () => {
    await axios
      .post(`${apiUrl}/api/v1/user/balance`, {
        userId: localStorage.getItem("userId"),
      })
      .then((response) => {
        setBalance(response.data.balance.toFixed(2));
        // console.log(response);
      });
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <>
      <div className="m-0 bg-slate-200">
        <div className="flex justify-between  border px-4 py-2 bg-slate-400 rounded">
          <div className="font-bold text-lg">Payment App</div>
          <div className="font-semibold pt-1">
            {firstName} {lastName}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              navigate("/signin");
            }}
            className="border bg-blue-500 hover:bg-blue-700  rounded text-white font-bold py-1.5 px-2"
          >
            LogOut
          </button>
        </div>
        <div className="font-bold p-2 ">Your Balance ${balance}</div>
        <div className="font-bold p-2">Users</div>
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          className="border border-gray-300  focus:outline-none px-4 py-2  mb-2 rounded-md w-1/2"
          type="text"
          placeholder="Search users..."
        />

        <div>
          {users.map((user) => (
            <User key={user._id} user={user} balance={balance} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;

function User({ user,balance }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between  px-2">
        <div className="flex">
          <div className="rounded-full h-9 w-9 bg-slate-400  mt-1 mr-2 px-3 text-lg font-semibold ">
            {user.firstName[0].toUpperCase()}
          </div>
          <div className="mt-1 mr-2">
            {user.firstName} {user.lastName}
          </div>
        </div>
        <button
          onClick={(e) => {
            // history.pushState("/send?id="+user._id+"&name="+user.firstName)
            navigate(
              "/send?id=" +
                user._id +
                "&name=" +
                user.firstName +
                "&lastName=" +
                user.lastName +
                "&balance=" +
                balance
            );
          }}
          className="border bg-blue-500 hover:bg-blue-700  rounded text-white font-bold py-1.5 px-4 mt-1"
        >
          Send Money
        </button>
      </div>
    </>
  );
}
