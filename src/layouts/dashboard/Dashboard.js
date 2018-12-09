/* eslint-disable */
import React, {
  Component
} from 'react'

//引入queryMeta.sol编译后的queryMeta.json
import queryMetaContract from '../../../build/contracts/queryMeta.json'

import getWeb3 from '../../util/web3/getWeb3'
import Web3 from 'web3'
//import test1 from '../../test.js'
//query = require('../../test.js')

class Dashboard extends Component {
    constructor(props, {authData})
   {
      super(props)
      authData = this.props

      this.state = {

        storageValue: 0,
        web3: null,
        accounts: [], //保存所有账户
        //metaCoinInstance: null, //保存合约实例，方便在其他地方调用
        //balance: 0, //保存查询账户余额

        queryMetaInstance: null, //保存合约实例，方便在其他地方调用

        owner: 0,
        timestamp: "",
        allowedRole:0,
        //
        // EMRMetasCount:0
    }
  }

  /**
   * 初始化
   * 把web3保存在state中。
   */
  componentWillMount() {
    console.log("%cmount", "color:green")

    // getWeb3
    // .then(results => {
    //   this.setState({
    //     web3: results.web3
    //   })
    //   this.instantiateContract()
    // })
    // .catch((err) => {
    //   console.log('Error finding web3.',err)
    // })

    let web3 = window.web3;

      //set web3 & truffle contract
      if (typeof web3 !== 'undefined') {
          // Use Mist/MetaMask's provider
          this.state.web3 = new Web3(web3.currentProvider);
     }
     else{
        console.log('Error finding web3.')
     }

     this.instantiateContract()

  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const queryMeta = contract(queryMetaContract)
    queryMeta.setProvider(this.state.web3.currentProvider)

    if (typeof web3 === 'undefined')
       console.log("undefined web3");

    //queryMeta.setProvider(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

    console.log("%cmiao", "color:green");

    //获取所有账户，用来做列表显示
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({
        accounts: accounts
      })

      //部署合约，保存合约实例
      queryMeta.deployed()
        .then((instance) => {
          //this.setState({
            this.state.queryMetaInstance = instance
          //})
        })

      this.state.web3.eth.defaultAccount = this.state.web3.eth.accounts[0]

      //设置默认账户。
      //queryMeta.defaults({from:"0x6f06a3F922F7a5a3e5a4EdaF0E64D10F651A3A5D"})
    })
  }

  /**
   * 查询medical data
   * 获取输入框中的patient ID
   * 合约实例调用 getDB_login_infos方法,
   * 检查该data的metadata是否存在 && 访问该data的用户（当前calling contract的用户是否有权限访问)
   * 若合法（满足以上两种情况，则提供登进数据库的username和password
   * 若不合法，则给出提示信息
   */
  queryData() {
    var patientID = this.refs.qData_patientID_from.value;

    this.state.queryMetaInstance.getMeta(patientID)
      .then(result => {
        //返回的result是一个BigNumber类型数据，toString转出数字字符串
        //console.log(result[0].toString())
        if (result[0].toString() !== "0") //该data的metadata存在
        {
          //此处先不对用户的身份进行核查
          this.state.queryMetaInstance.getDB_login_infos()
          .then(loginInfo =>{
            this.refs.username_from.value = loginInfo[0].toString();
            this.refs.password_from.value = loginInfo[1].toString();
          })
        }
        else  //该data的metadata不存在
        {
           this.refs.username_from.value = "access denied";
           this.refs.password_from.value = "access denied";
        }

      })

      this.refs.qData_patientID_from.value = ""; //清空输入框，方便下一次查询
  }

  /**
   * 查询medical metadata
   * 获取输入框中的patient ID
   * 合约实例调用 getMeta方法
   */
  queryMeta() {
    var patientID = this.refs.q_patientID_from.value;
    console.log(patientID);

    this.state.queryMetaInstance.getMeta(patientID)
      .then(result => {
        //返回的result是一个BigNumber类型数据，toString转出数字字符串
        //console.log(result[0].toString())

        if (result[0].toString() !== "0") //该data的metadata存在
        {
          this.refs.show_patientID_from.value = result[0].toString(),
          this.refs.show_timestamp_from.value = result[1].toString(),
          this.refs.show_allowedRole_from.value = result[2].toNumber()
        }
        else  //该data的metadata不存在
        {
           this.refs.show_patientID_from.value = "no metadata found";
           this.refs.show_timestamp_from.value = "no metadata found";
           this.refs.show_allowedRole_from.value = "no metadata found"
        }
        // this.setState({
        //     owner: result[0].toString()
        // })
        // this.setState({
        //     timestamp: result[1].toString()
        // })
        // this.setState({
        //     allowedRole: result[2].toNumber()
        // })
      })

      this.refs.q_patientID_from.value = ""; //清空输入框，方便下一次查询
      //console.log('EMRMetasCount:', this.state.owner);

      /*==========try to connect to PostgreSQL in front-end js====================*/
  }

  /**
   * 增加medical metadata
   * 获取输入框中的patient ID， timeStamp， allowedRole
   * 合约实例调用 addMetas方法
   */
  addMeta() {
    var patientID = this.refs.a_patientID_from.value;
    var timeStamp = this.refs.timestamp_from.value;
    var allowedRole = this.refs.allowedRole_from.value;

    this.state.queryMetaInstance.addMetas(patientID,timeStamp,allowedRole)

    //alert('Added a new medical metadata successfully!')
    //分布式确认不能简单给提示

    //清空输入框，方便下一次增加
    this.refs.a_patientID_from.value = "";
    this.refs.timestamp_from.value = "";
    this.refs.allowedRole_from.value = "";
  }

  /**
   * 更新medical metadata
   * 获取输入框中的patient ID， timeStamp， allowedRole
   * 合约实例调用 updateMetas方法
   */

  updateMeta(){
    var patientID = this.refs.show_patientID_from.value;
    var timeStamp = this.refs.show_timestamp_from.value;
    var allowedRole = this.refs.show_allowedRole_from.value;

    this.state.queryMetaInstance.updateMetas(patientID,timeStamp,allowedRole)

    //alert('Updated a new medical metadata successfully!')
    //分布式确认不能简单给提示

    //清空输入框
    this.refs.show_patientID_from.value = "";
    this.refs.show_timestamp_from.value = "";
    this.refs.show_allowedRole_from.value = "";
  }


  //一个组件类必须要实现一个 render 方法，这个 render 方法必须要返回一个 JSX 元素。
  //但这里要注意的是，必须要用一个外层的 JSX 元素把所有内容包裹起来。
  render() {
    return (
      <main className = "container">

        <div className = "pure-g" >
           <div className = "pure-u-1-1" >
                { /*<h1>Dashboard</h1>*/ }
                <h1 >
                  < strong > Hi, {this.props.authData.name}! < /strong>
                </h1 >
                {/*<p>If you're seeing this page, you've logged in with your own smart contract successfully.</p>*/ }

                <p> Now you can operate on medical data by clicking one of these buttons below. </p>

                <h5> (For prototype, just show all now.Later can add buttons to shoose) </h5>
            </div >

            <div className = "pure-u-1-1" >
                <p>= === === === === ==== === === === === === === === === === === === === === === === === === === === = </p>

                <h1> EMRMetas Records </h1>

                <p> These records are synchronized all network. (To show this is a DApp (Decentralized APPlication)) </p>

                <hr />
            </div>

            <div className = "pure-u-1-2" >
                <h2> Query (Update) Meta</h2> (please input the patient ID)
                <p></p>

                <div> patient ID： <input ref = "q_patientID_from" /></div>
                 <p></p>

                <button onClick = {this.queryMeta.bind(this)}> query medical metadata </button>
            </div>

            {/*
            <div id = "loader" className = "pure-u-1-1">
              <p class = "text-center"> Loading... </p>

            </div>*/}

            <div className = "pure-u-1-2" >
                <h2>Add Meta </h2> (please input the meta infos)
                <p></p>

                <div> patient ID： <input ref = "a_patientID_from" /></div>
                 <p></p>

                 <div> timeStamp： <input ref = "timestamp_from" /></div>
                 <p></p>

                 <div> allowedRole： <input ref = "allowedRole_from" /></div>
                 <p></p>


                <button className="btn btn-primary" onClick = {this.addMeta.bind(this)}> add medical metadata </button>

            </div>

            <div className = "pure-u-1-2" >
                <h4> The metadata of this patient record is as follow. (If all data below are 0, then this record doesn't exist!)</h4>


                {/*}<h5> patient ID: {this.state.owner}</h5>
                // <h5> TimeStamp (last modified): {this.state.timestamp}</h5>
                // <h5> AllowedRole: {this.state.allowedRole}</h5>*/}

                <h5> patient ID: <input ref = "show_patientID_from" /></h5>
                <h5> TimeStamp (last modified): <input ref = "show_timestamp_from" /></h5>
                <h5> AllowedRole: <input ref = "show_allowedRole_from" /></h5>

                <button onClick = {this.updateMeta.bind(this)}> update medical metadata </button>
            </div>





            <div className = "pure-u-1-2" >
                <h2> Query data</h2> (please input the patient ID)
                <p></p>

                <div> patient ID： <input ref = "qData_patientID_from" /></div>
                 <p></p>

                <button onClick = {this.queryData.bind(this)}> query medical data </button>
                {/*用户查询数据，需满足 contract中有此数据的metadata（证明此数据还在），
                  而且用户的身份满足该metadata中指定访问的用户身份*/}

                <h3> You can access the data by this identity: </h3>
                <div> Username： <input ref = "username_from" /></div>
                <div> Password： <input ref = "password_from" /></div>

            </div>
        </div >

      </main>
    )
  }
}

export default Dashboard
