import React, { useEffect } from "react";
import axios from "axios";

let P_API = process.env.P_API;

const sendCode = async (code) => {
  try {
    let res = await axios.get(
      `${P_API}/connect/twitter/callback?code=${code}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (res.status == 200) {
      console.log(res.data.data);
      // window.location = localStorage.getItem('redirect_pre_discord');
      window.location = "/edit-profile?page=social#twitter-success";
    } else {
      alert("auth failed Please try again");
    }
  } catch (error) {
    alert("auth failed Please try again");
    window.location = "/edit-profile?page=social#twitter-failed";
  }
};

function Callback({ query }) {
  let code = query.code;

  useEffect(() => {
    sendCode(code);
  }, []);

  return <div></div>;
}

//SSR DATA HOME PAGE
export async function getServerSideProps(ctx) {
  let query = ctx.query;
  axios;

  return {
    props: {
      query: query,
    },
  };
}

export default Callback;
