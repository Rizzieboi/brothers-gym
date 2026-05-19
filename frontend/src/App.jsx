import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import "./App.css";

import Login from "./Login";
import MemberModal from "./MemberModal";

function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      localStorage.getItem("gymLoggedIn")
      === "true"
    );

  const [userRole, setUserRole] =
    useState(
      localStorage.getItem("gymUserRole")
    );

  const [loggedInMember, setLoggedInMember] =
    useState(
      JSON.parse(
        localStorage.getItem("gymMember")
      )
    );

  const [members, setMembers] =
    useState([]);

  const [selectedMember, setSelectedMember] =
    useState(null);

  const [searchPhone, setSearchPhone] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      email: "",
      password: "",
      membership_plan: "Monthly",
      amount: 1500,
      admission_fee: 1000,
      payment_method: "Cash",
    });



  // FETCH MEMBERS
  const fetchMembers = async () => {

    try {

      const response =
        await axios.get(
          "https://brothers-gym-backend.onrender.com/api/members/all-members"
        );

      setMembers(response.data.data);

    } catch (error) {

      console.log(error);
    }
  };



  useEffect(() => {

    if (isLoggedIn) {
      fetchMembers();
    }

  }, [isLoggedIn]);



  // HANDLE INPUT
  const handleChange = (e) => {

    const { name, value } = e.target;

    let updatedAmount =
      formData.amount;

    if (name === "membership_plan") {

      if (value === "Monthly") {
        updatedAmount = 1500;
      }

      else if (value === "Quarterly") {
        updatedAmount = 4000;
      }

      else if (value === "Half-Yearly") {
        updatedAmount = 7000;
      }

      else if (value === "Yearly") {
        updatedAmount = 12000;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
      amount: updatedAmount,
    });
  };



  // ADD MEMBER
  const addMember = async () => {

    try {

      const phoneRegex =
        /^[0-9]{10}$/;

      if (
        !phoneRegex.test(
          formData.phone
        )
      ) {

        alert(
          "Phone number must be exactly 10 digits"
        );

        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          formData.email
        )
      ) {

        alert(
          "Invalid email format"
        );

        return;
      }

      await axios.post(
        "https://brothers-gym-backend.onrender.com/api/members",
        formData
      );

      alert(
        "Member Added Successfully"
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        membership_plan: "Monthly",
        amount: 1500,
        admission_fee: 1000,
        payment_method: "Cash",
      });

      fetchMembers();

    } catch (error) {

      console.log(error);

      alert(
        "Error adding member"
      );
    }
  };



  // SEARCH
  const filteredMembers =
    members.filter(
      (member) =>
        member.phone.includes(
          searchPhone
        )
    );



  // EXPORT EXCEL
  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        members
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Members"
    );

    XLSX.writeFile(
      workbook,
      "BrothersGymMembers.xlsx"
    );
  };



  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem(
      "gymLoggedIn"
    );

    localStorage.removeItem(
      "gymUserRole"
    );

    localStorage.removeItem(
      "gymMember"
    );

    setIsLoggedIn(false);

    setUserRole(null);

    setLoggedInMember(null);
  };



  // LOGIN PAGE
  if (!isLoggedIn) {

    return (
      <Login
        setIsLoggedIn={
          setIsLoggedIn
        }
        setUserRole={
          setUserRole
        }
        setLoggedInMember={
          setLoggedInMember
        }
      />
    );
  }



  return (

    <div className="container">

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
        }}
      >

        <h1>
          BROTHERS GYM
        </h1>

        <button
          onClick={
            handleLogout
          }
          className="delete-btn"
        >
          Logout
        </button>

      </div>



      {/* ADD MEMBER */}

      {userRole ===
        "admin" && (

        <div className="form-container">

          <h2>
            Add New Member
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={
              formData.phone
            }
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="email"
            placeholder="Email"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
          />

          <select
            name="membership_plan"
            value={
              formData.membership_plan
            }
            onChange={
              handleChange
            }
          >
            <option>
              Monthly
            </option>

            <option>
              Quarterly
            </option>

            <option>
              Half-Yearly
            </option>

            <option>
              Yearly
            </option>

          </select>

          <input
            type="number"
            name="admission_fee"
            placeholder="Admission Fee"
            value={
              formData.admission_fee
            }
            onChange={
              handleChange
            }
          />

          <input
            type="number"
            value={
              Number(
                formData.amount
              ) +
              Number(
                formData.admission_fee
              )
            }
            readOnly
          />

          <select
            name="payment_method"
            value={
              formData.payment_method
            }
            onChange={
              handleChange
            }
          >
            <option>
              Cash
            </option>

            <option>
              UPI
            </option>

            <option>
              Card
            </option>

          </select>

          <button
            onClick={
              addMember
            }
          >
            Add Member
          </button>

        </div>
      )}



      {/* SEARCH */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search by phone"
          value={
            searchPhone
          }
          onChange={(e) =>
            setSearchPhone(
              e.target.value
            )
          }
        />

      </div>



      {/* EXPORT */}

      <button
        className="export-btn"
        onClick={
          exportExcel
        }
      >
        Export Excel
      </button>



      {/* TABLE */}

      <h2>
        All Members
      </h2>

      <table>

        <thead>

          <tr>

            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Total Paid</th>

          </tr>

        </thead>

        <tbody>

          {filteredMembers.map(
            (member) => (

              <tr
                key={member.id}
              >

                <td>
                  {member.name}
                </td>

                <td>
                  {member.phone}
                </td>

                <td>
                  {member.email}
                </td>

                <td>
                  {
                    member.membership_plan
                  }
                </td>

                <td>
                  ₹
                  {
                    Number(member.amount) +
                    Number(member.admission_fee)
                  }
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>



      <MemberModal
        member={
          selectedMember
        }
        closeModal={() =>
          setSelectedMember(
            null
          )
        }
      />

    </div>
  );
}

export default App;