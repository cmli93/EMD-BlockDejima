pragma solidity  ^0.4.24;

contract queryMeta {

    //Model metadata of EMR
    struct EMRMeta {
        uint owner; //patient ID; public will have getter and setter function automatically
        string timestamp;
        uint allowedRole;
        //struct updateInfo;
              /* should contain tag to show update or not (modified/origin);
               * who (has/have) updated;
               * where modified;
               * which peers already updated;
               * some other metadata about dejima;
               * current state of dejima;
               */
        // declare dejimaPeers; //An array to store the peers who share the dejima relating to the metadata
    }

    //Store EMRMetas
    mapping (uint => EMRMeta) public EMRMetas;
    //store EMRMetas count
    uint public EMRMetasCount;

    /*
       struct DB_login_info model the login info to access database (Dejima)
     */
    struct DB_login_info{
      string username;
      string password;
    }

    //Store DB_login_infos
    mapping (uint => DB_login_info) public DB_login_infos;

    /*
       struct User model the user calling this contract.
     */
    struct User{
      string name; //name of doctor or patient
      uint id;
      uint roleNum; /*
                    consider doctor only for the time being:
                      1 -> doctor
                      2 -> analyzer
                      3 -> insurance
                      4->  patient
                        */
    }

    //Store　roles
    mapping (uint => User) public users;
    //store EMRMetas count
    uint public usersCount;

    //update EMRMeta event
    event updateMetaEvent (
        uint indexed _owner
    );


    /*
     * Contructor, will run whenever we deploy the contract to the blockchain
     * (initialized contract upon migration)
     * same name as the contract
    */
    function queryMeta () public {
           //initialize users directly
           //users[0] = User("Alice", 888, 1); //doctor
           //users[1] = User("Bob", 87, 4); //a patient

           addUser("Alice", 888, 1);//doctor
           addUser("Bob", 87, 4);//a patient

           //initialize EMRMetas directly
           //EMRMetas[0] = EMRMeta(123, "20181118", 1);
           //EMRMetas[1] = EMRMeta(456, "20181119", 4);

           addMetas(123, "20181118", 1);
           addMetas(456, "20181119", 4);

           //initialize the login info to access dejima DB
           //这里先直接给一个最高权限的root信息，
           //之后在DB中创建了新的用户和密码之后可以给这块加新用户
           DB_login_infos[0] = DB_login_info("root", "dang5678");
    }

    function getDB_login_infos() view returns (string username, string password){
      return (DB_login_infos[0].username, DB_login_infos[0].password);
    }


    //return an object by given patient ID
    function getMeta(uint _id) view returns(uint owner, string timeStamp, uint allowedRole) {
      for (uint i = 1; i <= EMRMetasCount; i++)
      {
         if(EMRMetas[i].owner == _id)
                return (EMRMetas[i].owner, EMRMetas[i].timestamp, EMRMetas[i].allowedRole);
      }
      return (0,"0",0); //return id=0 if no result Meta found
    }


    //add a new medical metadata
    function addMetas (uint _owner, string _timestamp, uint _allowedRole) public{
        //addMetas　string _timestamp can be get automatically later (solidity date)

        //check role to be allowed to addEMRMetas
        //require(roles[msg.sender] == 1); //only a doctor can addEMRMetas now
        //here msg.sender is an address, msg.sender to identify the address of who calling this function

        /********************************************************************************/
        /*******Here we should consider to add "medical data" to cloud (dejima)**********/
        /********************************************************************************/

        EMRMetasCount ++;

        EMRMetas[EMRMetasCount] = EMRMeta(_owner, _timestamp, _allowedRole);

    }

    //add a new person who belongs a role
    function addUser (string _name, uint _id, uint _roleNum) private
    {
      //check the priviledge to add User

      // add users in the cloud

      usersCount ++;

      users[usersCount] = User(_name, _id, _roleNum);

    }

    //update an existing medical metadata, suppose will change the allowedRole
    function updateMetas (uint _owner, string _timestamp, uint _allowedRole ) public
    {
        //updateMetas　string _timestamp can be get automatically later

        //check role to be allowed to updateEMRMetas
        //require(roles[msg.sender] == 1); //only a doctor can updateEMRMetas now
        //here msg.sender is an address, msg.sender to identify the address of who calling this function

        /********************************************************************************/
        /*******Here we should consider to update "medical data" to cloud (dejima)**********/
        /********************************************************************************/

        for (uint i = 1; i <= EMRMetasCount; i++)
        {
           if(EMRMetas[i].owner == _owner)
           {
             EMRMetas[i].timestamp = _timestamp;
             EMRMetas[i].allowedRole = _allowedRole;
          }
        }

        // trigger updateMeta　Event
        updateMetaEvent(_owner);
    }

    /*deleteEMRMetas string _timestamp can be get automatically later
    function deleteEMRMetas (uint _owner, string _timestamp) private{

        //check role to be allowed to deleteEMRMetas
        require(roles[msg.sender] == 1); //only a doctor can deleteEMRMetas now

        /********************************************************************************/
        /*******Here we should consider to delete "medical data" to cloud (dejima)*******/
        /********************************************************************************/

        /*
          If a metadata is deleted, the owner ID is assigned to 0
          (if this, later will need to fresh EMRMetas to remove unuseful EMRMetas)


        //search EMRMetas using _owner

        //assign 0 to this _owner field

        //decrement the EMRMetasCount by 1

    }*/
}
