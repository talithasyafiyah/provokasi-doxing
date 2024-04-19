import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { LoginSocialFacebook } from "reactjs-social-login";

import { FacebookLoginButton } from "react-social-login-buttons";

function FbLogin({ buttonText }) {
  const navigate = useNavigate();
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);

  return (
    <div>
      {!profile ? (
        <LoginSocialFacebook
          isOnlyGetToken
          appId="1216211556029829"
          onResolve={(response) => {
            console.log("response", response);
            setProfile(response.data);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("login", "facebook");
            toast.success("Login successful.");
            setTimeout(() => {
              navigate("/", {
                state: { token: response.data.accessToken },
              });
            }, 1500);
          }}
          onReject={(err) => {
            console.log(err);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      ) : (
        ""
      )}

      {profile ? (
        <div>
          <h1>{profile.name}</h1>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FbLogin;
