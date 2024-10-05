import { Users } from "../components/User";
import { Balance } from "../components/Balance";
import {AppBar} from "../components/AppBar";
 function Dashboard(){
    return(
       <div>
        <AppBar />
        <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
        </div>
       </div>
    )
}

export default Dashboard;