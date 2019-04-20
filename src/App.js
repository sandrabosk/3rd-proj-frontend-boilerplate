import React, { Component } from 'react';
import './App.css';

import { Switch, NavLink, Route } from "react-router-dom";

import axios from "axios";

import Signup from './components/user-pages/Signup';
import Login from './components/user-pages/Login';
import Home from './components/Home';


import AddPhone from './components/phone-pages/AddPhone';

class App extends Component {
  constructor(){
    super();
    this.state = {
      currentUser: null,
    }
  }

  componentDidMount(){
    axios.get("http://localhost:3001/api/checkuser", { withCredentials:true })
    .then(responseFromBackend => {
      // console.log("Check User in APP.JS: ",responseFromBackend.data)
      const { userDoc } = responseFromBackend.data;
      this.syncCurrentUser(userDoc);
    });
  }

  // this is the method for updating "currentUser"
  // (must be defined in App.js since it's the owner of "currentUser" now)
  syncCurrentUser(user){
    this.setState({ currentUser: user });
  }


  render() {
    return (
      <div className="App">
        <header>
         <h1> IronPhones ☎ </h1>
         <nav>
          {/* Home will be always visible to everyone */}
            <NavLink to="/"> Home </NavLink>

          { this.state.currentUser ? (
            // these pages will be visible only if the user exists
            <NavLink to="/add-phone"> Add a Phone </NavLink>
          ) : (
            // these pages will be visible only if there is no user in the session
            <span>
              <NavLink to="/signup-page"> Signup </NavLink>
              <NavLink to="/login-page"> Login </NavLink>
            </span>
          ) }


           
         </nav>
        </header>

        <Switch>
          {/* this is example how to normally do the Route: */}
          {/* <Route path="/somePage" component={ someComponentThatWillRenderWhenUSerClickThisLink }   /> */}
        <Route exact path="/" component={ Home } />


         {/* this way we use when we are passing params down to componentDidMount() {
           so we can't use component={}, but instead we have to use render ={() => <someComponent/>}
         }
          */}
          <Route path="/signup-page" render={ () => 
            <Signup currentUser={this.state.currentUser} 
            onUserChange={ userDoc => this.syncCurrentUser(userDoc) }   />
          }  />

          
          <Route path="/login-page" render={ () => 
            <Login currentUser={ this.state.currentUser } 
            onUserChange={userDoc => this.syncCurrentUser(userDoc)} />
          }  />

          <Route path="/add-phone" component={ AddPhone }/>
          
        </Switch>

        

        <footer>
          Made with ❤️ at Ironhack - PTWD 2019
        </footer>
      </div>
    );
  }
}

export default App;
