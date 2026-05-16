const express = require("express");

const router = express.Router();

const supabase = require("../config/supabaseClient");



// ADD MEMBER
router.post("/add-member", async (req, res) => {

  const {
    name,
    phone,
    email,
    password,
    membership_plan,
    amount,
    admission_fee,
    payment_method,
  } = req.body;

  const total_amount =
    Number(amount) +
    Number(admission_fee || 0);

  const join_date = new Date();

  let expiry_date = new Date();

  let status = "active";

  if (membership_plan === "Monthly") {
    expiry_date.setDate(expiry_date.getDate() + 30);
  }

  else if (membership_plan === "Quarterly") {
    expiry_date.setDate(expiry_date.getDate() + 90);
  }

  else if (membership_plan === "Half-Yearly") {
    expiry_date.setDate(expiry_date.getDate() + 180);
  }

  else if (membership_plan === "Yearly") {
    expiry_date.setDate(expiry_date.getDate() + 365);
  }

  const { data, error } = await supabase
    .from("members")
    .insert([
      {
        name,
        phone,
        email,
        password,
        membership_plan,
        amount: total_amount,
        admission_fee,
        payment_method,
        payment_status: "Paid",
        payment_date: new Date(),
        join_date,
        expiry_date,
        attendance_count: 0,
        status,
      },
    ])
    .select();

  if (error) {

    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "Member added successfully",
    data,
  });
});



// GET ALL MEMBERS
router.get("/all-members", async (req, res) => {

  const { data, error } = await supabase
    .from("members")
    .select("*");

  if (error) {

    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "Members fetched successfully",
    data,
  });
});



// MARK ATTENDANCE
router.put("/mark-attendance/:id", async (req, res) => {

  const { id } = req.params;

  const { data: memberData } =
    await supabase
      .from("members")
      .select("attendance_count")
      .eq("id", id)
      .single();

  const currentAttendance =
    memberData.attendance_count || 0;

  const { data, error } = await supabase
    .from("members")
    .update({
      attendance_count:
        currentAttendance + 1,
    })
    .eq("id", id)
    .select();

  if (error) {

    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "Attendance marked successfully",
    data,
  });
});



// RENEW MEMBERSHIP
router.put("/renew-membership/:id", async (req, res) => {

  const { id } = req.params;

  const {
    membership_plan,
    amount,
    payment_method,
  } = req.body;

  let expiry_date = new Date();

  if (membership_plan === "Monthly") {
    expiry_date.setDate(expiry_date.getDate() + 30);
  }

  else if (membership_plan === "Quarterly") {
    expiry_date.setDate(expiry_date.getDate() + 90);
  }

  else if (membership_plan === "Half-Yearly") {
    expiry_date.setDate(expiry_date.getDate() + 180);
  }

  else if (membership_plan === "Yearly") {
    expiry_date.setDate(expiry_date.getDate() + 365);
  }

  const { data, error } = await supabase
    .from("members")
    .update({
      membership_plan,
      amount,
      payment_method,
      payment_status: "Paid",
      payment_date: new Date(),
      expiry_date,
      status: "active",
    })
    .eq("id", id)
    .select();

  if (error) {

    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "Membership renewed successfully",
    data,
  });
});



// DELETE MEMBER
router.delete("/delete-member/:id", async (req, res) => {

  const { id } = req.params;

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id);

  if (error) {

    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "Member deleted successfully",
  });
});



module.exports = router;