import Heading from "../components/heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import { Button } from "../components/Button";
function SignUp(){
    return(
      //   <div>
      //
      //   </div>


      <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign Up"} />
         <SubHeading label={"Enter your information to create account"} />
           <InputBox label={"First name"  } placeholde={"John"} />
           <InputBox label={"Last name"  } placeholde={"Doe"} />
           <InputBox label={"User name"  } placeholde={"akash@gmail.com"} />
           <InputBox label={"Password"  } placeholde={"12345678"} />
           <Button  label={"Sign up"}/>
        </div>
      </div>
    </div>
    )
}

export default SignUp;