import React, { Component } from 'react';
import './App.css';

import { Switch, NavLink, Route } from "react-router-dom";

import axios from "axios";

import Signup from './components/user-pages/Signup';
import Login from './components/user-pages/Login';
import Home from './components/Home';


import AddPhone from './components/phone-pages/AddPhone';
import PhoneList from './components/phone-pages/PhoneList';

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

  logout(){
    axios.delete(
      "http://localhost:3001/api/logout",
      { withCredentials: true }
    )
    .then( () => this.syncCurrentUser(null))
    .catch( err => console.log(err));
  }


  render() {
    return (
      <div className="App">
        <header>
         <h1> IronPhones ☎ </h1>
         <nav>
          {/* Home will be always visible to everyone */}
            <NavLink to="/"> Home </NavLink>
            <NavLink to="/phone-list"> Phones </NavLink>
          { this.state.currentUser ? (
            // these pages will be visible only if the user exists
            <span>
              <NavLink to="/add-phone"> Add a Phone </NavLink>
              <br />
              <b> { this.state.currentUser.fullName } </b>
              <button onClick={ () => this.logout() }> Log out </button>
            </span>
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
          {/* to prevent users to access the routs when they are not logged in,
          we are passing currentUser into the component so we can check there whether it's available there */}
          <Route path="/add-phone" render={ () => <AddPhone currentUser={ this.state.currentUser }  /> }/>
          <Route path="/phone-list" component={ PhoneList }/>
        </Switch>

        <footer>
          <p> Made with ❤️ at Ironhack - PTWD 2019 </p>
        </footer>
      </div>
    );
  }
}

export default App;
