pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract Role {
    struct patient {
        string name;
        uint age;
        string password;
        address[] doctorAccessList;
        string[] patientRecordList;
    }

    struct doctor {
        string name;
        uint age;
        string password;
        address[] patientAccessList;
    }

    address[] public patientList;
    address[] public doctorList;

    mapping (address => patient) patientInfo;
    mapping (address => doctor) doctorInfo;

    function add_agent(string _name, uint _age, uint _designation, string _password) public {
        address addr = msg.sender;

        if(_designation == 0){
            patientInfo[addr].name = _name;
            patientInfo[addr].age = _age;
            patientInfo[addr].password = _password;
            patientList.push(addr)-1;
        }
       else if (_designation == 1){
            doctorInfo[addr].name = _name;
            doctorInfo[addr].age = _age;
            doctorInfo[addr].password = _password;
            doctorList.push(addr)-1;

       }
       else{
           revert();
       }
    }

    function get_patient(address addr) view public returns (string, uint, string, string[]){

        return (patientInfo[addr].name, patientInfo[addr].age, patientInfo[addr].password, patientInfo[addr].patientRecordList);
    }

    function get_doctor(address addr) view public returns (string, uint, string){

        return (doctorInfo[addr].name, doctorInfo[addr].age, doctorInfo[addr].password);
    }
    function get_patient_doctor_name(address paddr, address daddr) view public returns (string, string){
        return (patientInfo[paddr].name,doctorInfo[daddr].name);
    }


    function permit_access(address addr) public {

        doctorInfo[addr].patientAccessList.push(msg.sender)-1;
        patientInfo[msg.sender].doctorAccessList.push(addr)-1;


    }

    function remove_element_in_array(address[] storage Array, address addr) internal returns(uint)
    {
        bool check = false;
        uint del_index = 0;
        for(uint i = 0; i<Array.length; i++){
            if(Array[i] == addr){
                check = true;
                del_index = i;
            }
        }
        if(!check) revert();
        else{
            if(Array.length == 1){
                delete Array[del_index];
            }
            else {
                Array[del_index] = Array[Array.length - 1];
                delete Array[Array.length - 1];

            }
            Array.length--;
        }
    }
    function remove_element_in_records(string[] storage Array, string rhash) internal returns(uint)
    {
        bool check = false;
        uint del_index = 0;
        for(uint i = 0; i<Array.length; i++){
            if(keccak256(abi.encodePacked(Array[i])) == keccak256(abi.encodePacked(rhash))){
                check = true;
                del_index = i;
            }
        }
        if(!check) revert();
        else{
            if(Array.length == 1){
                delete Array[del_index];
            }
            else {
                Array[del_index] = Array[Array.length - 1];
                delete Array[Array.length - 1];

            }
            Array.length--;
        }
    }

    function remove_patient(address paddr, address daddr) public {
        remove_element_in_array(doctorInfo[daddr].patientAccessList, paddr);
        remove_element_in_array(patientInfo[paddr].doctorAccessList, daddr);
    }

    function get_accessed_doctorlist_for_patient(address addr) public view returns (address[])
    {
        address[] storage doctoraddr = patientInfo[addr].doctorAccessList;
        return doctoraddr;
    }
    function get_accessed_patientlist_for_doctor(address addr) public view returns (address[])
    {
        return doctorInfo[addr].patientAccessList;
    }


    function revoke_access(address daddr) public{
        remove_patient(msg.sender,daddr);

    }

    function get_patient_list() public view returns(address[]){
        return patientList;
    }

    function get_doctor_list() public view returns(address[]){
        return doctorList;
    }

    function get_hash(address paddr) public view returns(string[]){
        return patientInfo[paddr].patientRecordList;
    }

    function push_hash(string _hash) public {
        patientInfo[msg.sender].patientRecordList.push(_hash)-1;
    }

    function delete_hash(address paddr, string rhash) public {
      remove_element_in_records(patientInfo[paddr].patientRecordList, rhash);
    }
}
