import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">

        <div className="pure-u-1-1">

          <h2>Intro</h2>

          This system implements electronic medical records sharing between multiple parties.

          <br />
          <br />

          Note that it is built based on the Ethereum and bidirectional transformation technology.

          <h2>Here you can do :</h2>
          <ui>
          <li> Create a new account to access our system by clicking the Sign Up button on upper-right corner. </li>

          <br />

          <li> Login our system by clicking the login button on upper-right corner. If there is no user information for the given address, you'll be redirected to sign up. </li>

          <br />

          <li> Once you have logged in, you can query, add, update and delete the medical records. Of course this should be permitted only if your identity is valid.</li>
          {/*}<p>There are two authenticated routes: "/dashboard", which displays the user's name once authenticated; and "/profile", which allows a user to update their name.</p>*/}
          </ui>

          <br />

          <li>You can always come here by clicking Home button on upper-left corner.</li>

          {/*}
          <h3>Accessing User Data</h3>
          <p>Once authenticated, any component can access the user's data by assigning the authData object to a component's props.<br/><code>{"// In component's render function."}<br/>{"const { authData } = this.props"}<br/><br/>{"// Use in component."}<br/>{"Hello { this.props.authData.name }!"}</code></p>
          */}
          <h3>Github Address</h3>
          <p>You can find the source code of this project by clicking <a href="https://github.com/cmli93/EMD-BlockDejima" target="_blank">here</a>.</p>
        </div>

      </div>

          <div className="pure-u-1-1">

           <img src="https://picsum.photos/800/300" role="presentation"/>
           {/* 此处随机使用一张网络上的图片，同目录下的doctor.jpg需使得网络上服务器使用*/}

          </div>


      </main>
    )
  }
}

export default Home
