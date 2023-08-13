import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import {BrowserView, MobileView} from 'react-device-detect';
import Home from "./Home";
import Gift from "./Gift";
import Redeem from "./Redeem";
import PageNotFound from "./PageNotFound";

const Main = () => {
    return (
      <>
      <BrowserRouter>
          <Switch>
          <Route path="/" exact component={Home}/>
          <BrowserView>
            <Route path="/mint" exact component={Gift} />
            <Route path="/redeem" exact component={Redeem}/>
            </BrowserView>        
          </Switch>
      </BrowserRouter>
      </>
    )
}

export default Main