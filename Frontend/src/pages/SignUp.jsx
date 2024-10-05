import Heading from "../components/heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import { Button } from "../components/Button";
import { Bottomwarning } from "../components/BottomWarning";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function SignUp() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: ""

  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleButton() {
    axios.post("http://localhost:8080/api/v1/user/signup", { ...formData }).then((response) => {
      localStorage.setItem("token",response.data.token);
      navigate('/dashboard');
    }).catch((error) => {
      console.error("There was an error!", error);
    });

  }
  return (


    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign Up"} />
          <SubHeading label={"Enter your information to create account"} />
          <InputBox label={"First name"} placeholde={"John"} name={"firstName"} onChange={handleChange} />
          <InputBox label={"Last name"} placeholde={"Doe"} name={"lastName"} onChange={handleChange} />
          <InputBox label={"User name"} placeholde={"akash@gmail.com"} name={"username"} onChange={handleChange} />
          <InputBox label={"Password"} placeholde={"12345678"} name={"password"} onChange={handleChange} />
          <div className="p-4">
            <Button label={"Sign up"} onClick={handleButton} />
          </div>
          <Bottomwarning
            label={"Already have an account ?"}
            text={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
