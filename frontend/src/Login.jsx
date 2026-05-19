import { useState } from "react";
import axios from "axios";

import "./App.css";

function Login({
  setIsLoggedIn,
  setUserRole,
  setLoggedInMember,
}) {

  const [loginType, setLoginType] =
    useState("admin");

  const [loginId, setLoginId] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");



  // ADMIN LOGIN

  const handleAdminLogin = () => {

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

      setIsLoggedIn(true);

      setUserRole("admin");

    } else {

      alert(
        "Invalid Admin Credentials"
      );
    }
  };




  // STAFF LOGIN

  const handleStaffLogin = () => {

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

      setIsLoggedIn(true);

      setUserRole("staff");

    } else {

      alert(
        "Invalid Staff Credentials"
      );
    }
  };




  // MEMBER LOGIN

  const handleMemberLogin =
    async () => {

      try {

        const response =
          await axios.get(
            "https://YOUR-RENDER-URL.onrender.com"
          );

        const members =
          response.data.data;

        const member =
          members.find(
            (m) =>
              m.phone === phone &&
              m.password ===
                password
          );

        if (member) {

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
            JSON.stringify(member)
          );

          setLoggedInMember(
            member
          );

          setIsLoggedIn(true);

          setUserRole(
            "member"
          );

        } else {

          alert(
            "Invalid Member Credentials"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          "Login Error"
        );
      }
    };




  // MAIN LOGIN

  const handleLogin = () => {

    if (
      loginType === "admin"
    ) {

      handleAdminLogin();
    }

    else if (
      loginType === "staff"
    ) {

      handleStaffLogin();
    }

    else {

      handleMemberLogin();
    }
  };




  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        background:
          "linear-gradient(to bottom right, #020617, #0f172a, #111827)",
      }}
    >

      <div
        style={{
          width: "400px",
          background:
            "rgba(30,41,59,0.9)",
          padding: "35px",
          borderRadius:
            "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.4)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom:
              "10px",
          }}
        >
          BROTHERS GYM
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom:
              "30px",
          }}
        >
          Multi Role Login
        </p>




        {/* LOGIN TYPE */}

        <select
          value={loginType}
          onChange={(e) =>
            setLoginType(
              e.target.value
            )
          }
          style={{
            width: "100%",
            marginBottom:
              "20px",
          }}
        >

          <option value="admin">
            Admin Login
          </option>

          <option value="staff">
            Staff Login
          </option>

          <option value="member">
            Member Login
          </option>

        </select>




        {/* ADMIN / STAFF */}

        {(loginType ===
          "admin" ||
          loginType ===
            "staff") && (

          <>

            <input
              type="text"
              placeholder="Login ID"
              value={loginId}
              onChange={(e) =>
                setLoginId(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                marginBottom:
                  "20px",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                marginBottom:
                  "20px",
              }}
            />

          </>
        )}




        {/* MEMBER */}

        {loginType ===
          "member" && (

          <>

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                marginBottom:
                  "20px",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                marginBottom:
                  "20px",
              }}
            />

          </>
        )}




        {/* LOGIN BUTTON */}

        <button
          onClick={
            handleLogin
          }
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
          }}
        >
          Login
        </button>




        {/* DEFAULT CREDENTIALS */}

        <div
          style={{
            marginTop: "25px",
            fontSize: "13px",
            color: "#94a3b8",
            lineHeight:
              "24px",
          }}
        >

          <p>
            Admin:
            ADMIN001 /
            admin123
          </p>

          <p>
            Staff:
            STAFF001 /
            staff123
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;