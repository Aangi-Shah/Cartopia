import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign In");
  const { token, setToken, navigate, backendUrl, cartItems, setCartItems } =
    useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //useRef for focusing email input
  const emailRef = useRef(null);

  useEffect(() => {
    // Focus email whenever screen opens or mode (Sign In / Sign Up) changes
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, [currentState]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
          cartData: cartItems,
        });

        if (response.data.success) {
          const { token: newToken, cartData } = response.data;

          setToken(newToken);
          localStorage.setItem("token", newToken);

          if (cartData) {
            setCartItems(cartData);
            localStorage.setItem("cartItems", JSON.stringify(cartData));
          }

          toast.success("Account created successfully");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
          cartData: cartItems,
        });

        if (response.data.success) {
          const { token: newToken, cartData } = response.data;

          setToken(newToken);
          localStorage.setItem("token", newToken);

          if (cartData) {
            setCartItems(cartData);
            localStorage.setItem("cartItems", JSON.stringify(cartData));
          }

          toast.success("Logged in successfully");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-10 mb-30 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regualar text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign In" ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      <input
        ref={emailRef}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p
          className="cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot your password?
        </p>
        {currentState === "Sign In" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Sign In")}
            className="cursor-pointer"
          >
            Sign In
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Sign In" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;