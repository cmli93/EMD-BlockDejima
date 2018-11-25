import React, {
  Component
} from 'react'
//引入MetaCoin.sol编译后的 MetaCoin.json
//import MetaCoinContract from '../../../build/contracts/MetaCoin.json'
//引入queryMeta.sol编译后的queryMeta.json
import queryMetaContract from '../../../build/contracts/queryMeta.json'

import getWeb3 from '../../util/web3/getWeb3'
import Web3 from 'web3'

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

    getWeb3
      .then(results => {
        // this.setState({
        //   web3: results.web3

        // })
        //console.log("web3 succeed");
        const { web3 } = results;

        this.instantiateContract(web3)

        this.setState({ web3 })

        //this.instantiateContract()
      })
      .catch((err) => {
        console.log('Error finding web3.', err)
      })

  }

  instantiateContract(web3) {
    const contract = require('truffle-contract')
    // const MetaCoin = contract(MetaCoinContract)
    // MetaCoin.setProvider(this.state.web3.currentProvider)
    const queryMeta = contract(queryMetaContract)

    console.log("come to initialize");

    if (typeof web3 === 'undefined')
       console.log("undefined web3");

    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')

    this.state.web3 = new Web3(provider)

    queryMeta.setProvider(this.state.web3.currentProvider);
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

      //设置默认账户。
      queryMeta.defaults({from:"0x6f06a3F922F7a5a3e5a4EdaF0E64D10F651A3A5D"})

    })
  }

  /**
   * 查询medical metadata
   * 获取输入框中的patient ID
   * 合约实例调用 getMeta方法
   */
  queryData() {
    var patientID = this.refs.q_patientID_from.value;
    console.log(patientID);

    this.state.queryMetaInstance.getMeta(patientID)
      .then(result => {
        //返回的result是一个BigNumber类型数据，toString转出数字字符串
        //console.log(result[0].toString())

        this.refs.show_patientID_from.value = result[0].toString(),

        this.refs.show_timestamp_from.value = result[1].toString(),

        this.refs.show_allowedRole_from.value = result[2].toNumber()
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

    this.refs.patientID_from.value = ""; //清空输入框，方便下一次查询
    //console.log('EMRMetasCount:', this.state.owner);
  }

  /**
   * 增加medical metadata
   * 获取输入框中的patient ID， timeStamp， allowedRole
   * 合约实例调用 addMetas方法
   */
  addData() {
    var patientID = this.refs.a_patientID_from.value;
    var timeStamp = this.refs.timestamp_from.value;
    var allowedRole = this.refs.allowedRole_from.value;

    this.state.queryMetaInstance.addMetas(patientID,timeStamp,allowedRole)

    alert('Added a new medical metadata successfully!')

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

  updateData(){
    var patientID = this.refs.show_patientID_from.value;
    var timeStamp = this.refs.show_timestamp_from.value;
    var allowedRole = this.refs.show_allowedRole_from.value;

    this.state.queryMetaInstance.updateMetas(patientID,timeStamp,allowedRole)

    alert('Updated a new medical metadata successfully!')

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

                <p> These records are synchronized all network.(To show this is a DApp(Decentralized APPlication)) </p>

                <hr />
            </div>

            <div className = "pure-u-1-1" >
                <h2> Query (Update) Meta</h2> (please input the patient ID)
                <p></p>

                <div> patient ID： <input ref = "q_patientID_from" /></div>
                 <p></p>

                <button onClick = {this.queryData.bind(this)}> query medical data </button>

            </div>

            {/*
            <div id = "loader" className = "pure-u-1-1">
              <p class = "text-center"> Loading... </p>

            </div>*/}

            <div className = "pure-u-1-1" >
                <h4> The patient record is as follow. (If all data below are 0, then this record doesn't exist!)</h4>


                {/*}<h5> patient ID: {this.state.owner}</h5>
                // <h5> TimeStamp (last modified): {this.state.timestamp}</h5>
                // <h5> AllowedRole: {this.state.allowedRole}</h5>*/}

                <h5> patient ID: <input ref = "show_patientID_from" /></h5>
                <h5> TimeStamp (last modified): <input ref = "show_timestamp_from" /></h5>
                <h5> AllowedRole: <input ref = "show_allowedRole_from" /></h5>

                <button onClick = {this.updateData.bind(this)}> update medical data </button>
            </div>

            <div className = "pure-u-1-1" >
                <h2>Add Meta </h2> (please input the meta infos)
                <p></p>

                <div> patient ID： <input ref = "a_patientID_from" /></div>
                 <p></p>

                 <div> timeStamp： <input ref = "timestamp_from" /></div>
                 <p></p>

                 <div> allowedRole： <input ref = "allowedRole_from" /></div>
                 <p></p>


                <button onClick = {this.addData.bind(this)}> add medical data </button>

            </div>
        </div >

      </main>
    )
  }
}

export default Dashboard
