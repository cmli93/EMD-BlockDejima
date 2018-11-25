import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
    //  <img src={/doctor.jpg} alt="" />
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            // <h1>Good to Go!</h1>
            // <p>Your Truffle Box is installed and ready.</p>

            <h2>Smart Contract Authentication</h2>
            <p>This particular box comes with autentication via a smart contract built-in.</p>
            <p>In the upper-right corner, you'll see a login button. Click it to login with with the Authentication smart contract. If there is no user information for the given address, you'll be redirected to sign up. There are two authenticated routes: "/dashboard", which displays the user's name once authenticated; and "/profile", which allows a user to update their name.</p>
            <h3>Redirect Path</h3>
            <p>This example redirects home ("/") when trying to access an authenticated route without first authenticating. You can change this path in the failureRedriectUrl property of the UserIsAuthenticated wrapper on <strong>line 9</strong> of util/wrappers.js.</p>
            <h3>Accessing User Data</h3>
            <p>Once authenticated, any component can access the user's data by assigning the authData object to a component's props.<br/><code>{"// In component's render function."}<br/>{"const { authData } = this.props"}<br/><br/>{"// Use in component."}<br/>{"Hello { this.props.authData.name }!"}</code></p>
            <h3>Github Address</h3>
            <p>You can find the source code of this project by clicking <a href="https://github.com/cmli93/EMD-BlockDejima" target="_blank">here</a>.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home