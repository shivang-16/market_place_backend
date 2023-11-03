import jwt from "jsonwebtoken";

const setCookie = async (user, res, message, statuscode = 200) => {
  const token = jwt.sign({ _id: user._id }, "fjsldajfoijf");
  await res
    .status(statuscode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message,
      user,
    });
};

export default setCookie;
