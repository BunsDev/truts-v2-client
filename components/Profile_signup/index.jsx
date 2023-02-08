import React, { useState, useEffect } from "react";
import styles from "./profile_signup.module.scss";
import axios from "axios";
import { useRouter } from "next/router";

const ProfileLogin = ({ showWalletConnect, setprofileSignupPrompt }) => {
  let P_API = process.env.P_API;
  const router = useRouter();

  useEffect(() => {
    window.router = router;
  }, []);

  async function handleCredentialResponse(response) {
    // console.log("Encoded JWT ID token: " + response.credential);
    let res = await axios.post(`${P_API}/login/google`, {
      token: response.credential,
    });
    if (res.status == 200) {
      let jwt = res.data.data.token;
      localStorage.setItem("token", `Bearer ${jwt}`);
      router.push("/profile");
    } else {
      alert("SignUp failed Please try Again");
    }
  }

  function signUpGoogle() {
    window.google.accounts.id.initialize({
      client_id: process.env.GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-login"),
      { theme: "outline", size: "large" }
      // customization attributes
    );
    window.google.accounts.id.prompt(); // also display the One Tap dialog
  }

  useEffect(() => {
    signUpGoogle();
  }, []);

  return (
    <div
      className={styles.profileLoginPage}
      onTransitionEnd={() => {
        setprofileSignupPrompt(false);
      }}
    >
      <div className={styles.loginModel}>
        <img
          alt=""
          onClick={() => {
            document
              .querySelector(`.${styles.profileLoginPage}`)
              .classList.add("close");
          }}
          src="/close-icon.png"
          className={styles.closeIcon}
        />
        <div className={styles.messageCon}>
          <h3>Let’s start by</h3>
          <h1>Sign up/Login</h1>
          <p>
            Sign up/Login with either email or wallet to start your web3 journey
            with Truts and earn some XPs!
          </p>
        </div>
        <div className={styles.colScreens}>
          <div className={styles.screen + " " + styles.right}>
            <div className={styles.imgBg}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20161128230037%21Google_%22G%22_Logo.svg"
                alt=""
              />
            </div>
            <p>
              Don`t have a web3 wallet? <br></br> You can use your google
              Account to signup/log in
            </p>
            <span style={{ marginTop: "10px" }} id={"google-login"}></span>
          </div>
          <div className={styles.screen}>
            <div className={styles.imgBg}>
              <img src="/assets/wallet-black.svg" alt="" />
            </div>
            <p>
              Your Wallet will also serve as your Truts ID with your Truts On
              Chain Reputation, so make sure to connect your primary wallet!
            </p>
            <button
              onClick={() => {
                showWalletConnect();
              }}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLogin;