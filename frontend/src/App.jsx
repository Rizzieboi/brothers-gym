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
          "https://YOUR-RENDER-URL.onrender.com"
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



      // WHATSAPP RECEIPT

      const totalPaid =
        Number(formData.amount) +
        Number(
          formData.admission_fee
        );

      const receiptMessage =
`
🏋️ BROTHERS GYM RECEIPT

Member:
${formData.name}

Plan:
${formData.membership_plan}

Membership Fee:
₹${formData.amount}

Admission Fee:
₹${formData.admission_fee}

Total Paid:
₹${totalPaid}

Payment Method:
${formData.payment_method}

Date:
${new Date().toLocaleDateString()}

Thank you for joining Brothers Gym 💪
`;



      const whatsappUrl =
        `https://wa.me/91${formData.phone}?text=${encodeURIComponent(receiptMessage)}`;

      window.open(
        whatsappUrl,
        "_blank"
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




  // DELETE MEMBER
  const deleteMember =
    async (id) => {

      try {

        await axios.delete(
          `https://YOUR-RENDER-URL.onrender.com`
        );

        alert(
          "Member Deleted"
        );

        fetchMembers();

      } catch (error) {

        console.log(error);
      }
    };




  // ATTENDANCE
  const markAttendance =
    async (id) => {

      try {

        await axios.put(
          `https://YOUR-RENDER-URL.onrender.com`
        );

        alert(
          "Attendance Marked"
        );

        fetchMembers();

      } catch (error) {

        console.log(error);
      }
    };




  // RENEW
  const renewMembership =
    async (member) => {

      try {

        await axios.put(
          `https://YOUR-RENDER-URL.onrender.com`,
          {
            membership_plan:
              "Monthly",
            amount: 1500,
            payment_method:
              "Cash",
          }
        );



        const renewalMessage =
`
🏋️ BROTHERS GYM RENEWAL RECEIPT

Member:
${member.name}

Plan Renewed:
Monthly

Amount Paid:
₹1500

Payment Method:
Cash

Date:
${new Date().toLocaleDateString()}

Thank you for renewing your membership 💪
`;



        const whatsappUrl =
          `https://wa.me/91${member.phone}?text=${encodeURIComponent(renewalMessage)}`;

        window.open(
          whatsappUrl,
          "_blank"
        );



        alert(
          "Membership Renewed"
        );

        fetchMembers();

      } catch (error) {

        console.log(error);
      }
    };




  // WHATSAPP REMINDER
  const sendWhatsAppReminder =
    (member) => {

      const message =
        `Hello ${member.name}, your membership at Brothers Gym is expiring soon. Please renew your membership.`;

      const whatsappUrl =
        `https://wa.me/91${member.phone}?text=${encodeURIComponent(message)}`;

      window.open(
        whatsappUrl,
        "_blank"
      );
    };




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




  // MEMBERSHIP STATUS
  const getMembershipStatus =
    (expiryDate) => {

      const today =
        new Date();

      const expiry =
        new Date(expiryDate);

      const difference =
        expiry - today;

      const daysLeft =
        Math.ceil(
          difference /
          (1000 *
            60 *
            60 *
            24)
        );

      if (daysLeft < 0) {
        return "Expired ❌";
      }

      if (daysLeft <= 5) {
        return "Expiring Soon ⚠️";
      }

      return "Active ✅";
    };




  // SEARCH
  const filteredMembers =
    members.filter(
      (member) =>
        member.phone.includes(
          searchPhone
        )
    );




  // DASHBOARD
  const totalMembers =
    members.length;

  const activeMembers =
    members.filter(
      (member) =>
        getMembershipStatus(
          member.expiry_date
        ) === "Active ✅"
    ).length;

  const expiredMembers =
    members.filter(
      (member) =>
        getMembershipStatus(
          member.expiry_date
        ) === "Expired ❌"
    ).length;

  const totalAttendance =
    members.reduce(
      (total, member) =>
        total +
        Number(
          member.attendance_count ||
            0
        ),
      0
    );

  const totalRevenue =
    members.reduce(
      (total, member) =>
        total +
        Number(
          member.amount || 0
        ),
      0
    );




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




      {/* DASHBOARD */}

      <div className="dashboard">

        <div className="card">
          <h3>Total Members</h3>
          <h1>{totalMembers}</h1>
        </div>

        <div className="card">
          <h3>Active Members</h3>
          <h1>{activeMembers}</h1>
        </div>

        <div className="card">
          <h3>Expired Members</h3>
          <h1>{expiredMembers}</h1>
        </div>

        <div className="card">
          <h3>Total Attendance</h3>
          <h1>{totalAttendance}</h1>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <h1>₹{totalRevenue}</h1>
        </div>

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

      {userRole ===
        "admin" && (

        <button
          className="export-btn"
          onClick={
            exportExcel
          }
        >
          Export Excel
        </button>
      )}





      {/* TABLE */}

      <h2>
        All Members
      </h2>

      <table>

        <thead>

          <tr>

            <th>Name</th>
            <th>Phone</th>
            <th>Plan</th>
            <th>Total Paid</th>
            <th>Status</th>
            <th>Attendance</th>
            <th>Actions</th>

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
                  {
                    member.membership_plan
                  }
                </td>

                <td>
                  ₹
                  {
                    member.amount
                  }
                </td>

                <td>
                  {
                    getMembershipStatus(
                      member.expiry_date
                    )
                  }
                </td>

                <td>
                  {
                    member.attendance_count
                  }
                </td>

                <td>

                  <button
                    onClick={() =>
                      setSelectedMember(
                        member
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      markAttendance(
                        member.id
                      )
                    }
                  >
                    Attendance
                  </button>

                  <button
                    className="renew-btn"
                    onClick={() =>
                      renewMembership(
                        member
                      )
                    }
                  >
                    Renew
                  </button>

                  <button
                    className="whatsapp-btn"
                    onClick={() =>
                      sendWhatsAppReminder(
                        member
                      )
                    }
                  >
                    WhatsApp
                  </button>

                  {userRole ===
                    "admin" && (

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteMember(
                          member.id
                        )
                      }
                    >
                      Delete
                    </button>
                  )}

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>




      {/* MODAL */}

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