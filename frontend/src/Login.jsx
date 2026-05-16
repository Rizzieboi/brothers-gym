import { useState } from "react";
import axios from "axios";

function Login({
  setIsLoggedIn,
  setUserRole,
  setLoggedInMember,
}) {

  const [loginType, setLoginType] =
    useState("member");

  const [phone, setPhone] =
    useState("");

  const [loginId, setLoginId] =
    useState("");

  const [password, setPassword] =
    useState("");



  // MEMBER LOGIN
  const handleMemberLogin =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/api/members/all-members"
          );

        const members =
          response.data.data;

        const foundMember =
          members.find(
            (member) =>
              member.phone === phone &&
              member.password === password
          );

        if (foundMember) {

          localStorage.setItem(
            "gymLoggedIn",
            "true"
          );

          localStorage.setItem(
            "gymUserRole",
            "member"
          );

          localStorage.setItem(
            "gymMember",
            JSON.stringify(foundMember)
          );

          setLoggedInMember(
            foundMember
          );

          setUserRole("member");

          setIsLoggedIn(true);

          return;
        }

        alert("Invalid Member Credentials");

      } catch (error) {

        console.log(error);
      }
    };




  // ADMIN LOGIN
  const handleAdminLogin =
    () => {

      if (
        loginId === "ADMIN001" &&
        password === "admin123"
      ) {

        localStorage.setItem(
          "gymLoggedIn",
          "true"
        );

        localStorage.setItem(
          "gymUserRole",
          "admin"
        );

        setUserRole("admin");

        setIsLoggedIn(true);

        return;
      }

      alert("Invalid Admin Credentials");
    };




  // STAFF LOGIN
  const handleStaffLogin =
    () => {

      if (
        loginId === "STAFF001" &&
        password === "staff123"
      ) {

        localStorage.setItem(
          "gymLoggedIn",
          "true"
        );

        localStorage.setItem(
          "gymUserRole",
          "staff"
        );

        setUserRole("staff");

        setIsLoggedIn(true);

        return;
      }

      alert("Invalid Staff Credentials");
    };




  // HANDLE LOGIN
  const handleLogin = () => {

    if (loginType === "member") {

      handleMemberLogin();
    }

    else if (loginType === "admin") {

      handleAdminLogin();
    }

    else if (loginType === "staff") {

      handleStaffLogin();
    }
  };




  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to right, #020617, #0f172a)",
      }}
    >

      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxShadow:
            "0px 0px 30px rgba(0,0,0,0.4)",
        }}
      >

        <h1
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "42px",
            margin: 0,
          }}
        >
          BROTHERS GYM
        </h1>

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          Multi Role Login
        </p>



        {/* LOGIN TYPE */}

        <select
          value={loginType}
          onChange={(e) =>
            setLoginType(e.target.value)
          }
          style={{
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #475569",
            background: "#0f172a",
            color: "white",
          }}
        >
          <option value="member">
            Member Login
          </option>

          <option value="staff">
            Staff Login
          </option>

          <option value="admin">
            Admin Login
          </option>
        </select>




        {/* MEMBER LOGIN */}

        {loginType === "member" && (

          <>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              style={{
                padding: "15px",
                borderRadius: "8px",
                border:
                  "1px solid #475569",
                background: "#0f172a",
                color: "white",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={{
                padding: "15px",
                borderRadius: "8px",
                border:
                  "1px solid #475569",
                background: "#0f172a",
                color: "white",
              }}
            />
          </>
        )}




        {/* ADMIN / STAFF LOGIN */}

        {(loginType === "admin" ||
          loginType === "staff") && (

          <>
            <input
              type="text"
              placeholder="Login ID"
              value={loginId}
              onChange={(e) =>
                setLoginId(e.target.value)
              }
              style={{
                padding: "15px",
                borderRadius: "8px",
                border:
                  "1px solid #475569",
                background: "#0f172a",
                color: "white",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={{
                padding: "15px",
                borderRadius: "8px",
                border:
                  "1px solid #475569",
                background: "#0f172a",
                color: "white",
              }}
            />
          </>
        )}




        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}
          style={{
            padding: "15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Login
        </button>



        {/* LOGIN DETAILS */}

        <div
          style={{
            color: "#94a3b8",
            fontSize: "13px",
            marginTop: "10px",
          }}
        >

          <p>
            Admin:
            ADMIN001 / admin123
          </p>

          <p>
            Staff:
            STAFF001 / staff123
          </p>

          <p>
            Members use:
            Phone + Password
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;