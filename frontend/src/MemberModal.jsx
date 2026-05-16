function MemberModal({
  member,
  closeModal,
}) {

  if (!member) return null;



  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background:
          "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >

      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "14px",
          width: "450px",
          color: "white",
          position: "relative",
        }}
      >

        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "red",
            border: "none",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          X
        </button>

        <h1
          style={{
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          Member Profile
        </h1>

        <div
          style={{
            display: "grid",
            gap: "14px",
            fontSize: "18px",
          }}
        >

          <div>
            <strong>Name:</strong>
            {" "}
            {member.name}
          </div>

          <div>
            <strong>Phone:</strong>
            {" "}
            {member.phone}
          </div>

          <div>
            <strong>Email:</strong>
            {" "}
            {member.email}
          </div>

          <div>
            <strong>Plan:</strong>
            {" "}
            {member.membership_plan}
          </div>

          <div>
            <strong>Amount:</strong>
            {" "}
            ₹{member.amount}
          </div>

          <div>
            <strong>Attendance:</strong>
            {" "}
            {member.attendance_count}
          </div>

          <div>
            <strong>Join Date:</strong>
            {" "}
            {
              new Date(
                member.join_date
              ).toLocaleDateString()
            }
          </div>

          <div>
            <strong>Expiry Date:</strong>
            {" "}
            {
              new Date(
                member.expiry_date
              ).toLocaleDateString()
            }
          </div>

        </div>

      </div>

    </div>
  );
}

export default MemberModal;