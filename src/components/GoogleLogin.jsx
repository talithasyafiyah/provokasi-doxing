import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin as Google } from "@react-oauth/google";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function GoogleLogin({ buttonText }) {
  const navigate = useNavigate();

  return (
    <>
      <Google
        width="160px"
        longtitle="true"
        shape="pill"
        type="standard"
        text="signin"
        locale="english"
        logo_alignment="center"
        onSuccess={(credentialResponse) => {
          localStorage.setItem("token", credentialResponse.credential);
          localStorage.setItem("login", "google");
          toast.success("Login successful.");
          setTimeout(() => {
            navigate("/", {
              state: { token: credentialResponse.credential },
            });
          }, 1500);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
}

export default GoogleLogin;
