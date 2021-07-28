
var $ = require("jquery");
const Web3 = require('web3');
const CryptoJS = require('crypto-js');
const ipfsClient = require("ipfs-http-client");
const ipfs = new ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol:'https'});
var contract;

$( document ).ready(function() {

if(window.ethereum){
  window.web3 = new Web3(window.ethereum);
 window.ethereum.enable();
}if(window.web3){
  window.web3 = new Web3(window.web3.currentProvider);
}else{
  window.alert('Please use Metamask!');
}

const web3 = window.web3;
var firstAccount;
const networkID =  web3.eth.net.getId();

const abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"doctorList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"patientList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_age","type":"uint256"},{"name":"_designation","type":"uint256"},{"name":"_password","type":"string"}],"name":"add_agent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_patient","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_doctor","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"paddr","type":"address"},{"name":"daddr","type":"address"}],"name":"get_patient_doctor_name","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"permit_access","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"paddr","type":"address"},{"name":"daddr","type":"address"}],"name":"remove_patient","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_accessed_doctorlist_for_patient","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_accessed_patientlist_for_doctor","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"daddr","type":"address"}],"name":"revoke_access","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get_patient_list","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_doctor_list","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"paddr","type":"address"}],"name":"get_hash","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"push_hash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"paddr","type":"address"},{"name":"rhash","type":"string"}],"name":"delete_hash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]');
const address = "0x3b98D43381C642B82C0168F6b8E16511667fC9E3";
const contract = new web3.eth.Contract(abi, address);

web3.eth.getAccounts().then(e => {
firstAccount = e[0];
console.log(firstAccount);
contract.methods.get_doctor(firstAccount).call().then(result=>{
  console.log(result);
  document.getElementById("dname").innerHTML = result[0];
  document.getElementById("d_age").innerHTML = result[1];
  document.getElementById("d_address").innerHTML = firstAccount;
});





contract.methods.get_accessed_patientlist_for_doctor(firstAccount).call().then(result =>{

for(i = 0; i< result.length; i++){
  let address = result[i];
  console.log(address);
  contract.methods.get_patient(result[i]).call().then(res=>{

    $('#viewPatient').append('<tr><td>'+res[0]+'</td><td>'+address+'</td><td><button id = "'+address+'" class= "rbutton">View</button></td></tr>');
    contract.methods.get_hash(address).call().then(result1 =>{
      let hash = result1;
      console.log(result1);
      $('#parentroot').append('<p>&nbsp;</p><p>&nbsp;</p><div id = "rooot'+address+'" style = "display:none; border: 10px solid transparent;padding: 15px;border-image: url(images/border.png) 30 stretch; width:800px;padding:35px;  10px;"><p>'+res[0]+'’s Records<br></p></div>')
      for(i = 0; i < result1.length; i++){
        let a = document.createElement('iframe');
        a.src = 'https://ipfs.infura.io/ipfs/'+result1[i];
        a.title = 'Document'+i;
        a.width = "700";
        a.height = "700";
        a.id = "abc"+address+"";
        let container = document.getElementById('rooot'+address+'');
        container.appendChild(a);
        container.appendChild(document.createElement('br'));
      }
    });
    $("#"+address+"").click(function(){
      $("#rooot"+address+"").toggle();
    });

  });
}
});




});

});
