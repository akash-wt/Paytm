import Heading from "../components/heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import { Button } from "../components/Button";
import { Bottomwarning } from "../components/BottomWarning";
import { useState } from "react";

function SignIn() {

  const [formData, setFormData] = useState({
    username: "",
    password: ""

  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign In"} />
          <SubHeading
            label={"Enter your credentials  to access tour account"}
          />
          <InputBox label={"User name"} placeholde={"akash@gmail.com"} name={"username"}  onChange={handleChange}/>
          <InputBox label={"Password"} placeholde={"12345678"} name={"password"}  onChange={handleChange}/>
          <div className="p-4">
            <Button label={"Sign up"} />
          </div>
          <Bottomwarning label={"Don't have an account ? "} text={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
