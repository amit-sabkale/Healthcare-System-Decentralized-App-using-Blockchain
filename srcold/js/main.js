
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

const abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"doctorList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"patientList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_age","type":"uint256"},{"name":"_designation","type":"uint256"},{"name":"_password","type":"string"}],"name":"add_agent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_patient","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_doctor","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"paddr","type":"address"},{"name":"daddr","type":"address"}],"name":"get_patient_doctor_name","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"permit_access","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"paddr","type":"address"},{"name":"daddr","type":"address"}],"name":"remove_patient","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_accessed_doctorlist_for_patient","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"get_accessed_patientlist_for_doctor","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"daddr","type":"address"}],"name":"revoke_access","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get_patient_list","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get_doctor_list","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"paddr","type":"address"}],"name":"get_hash","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"push_hash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]');
const address = "0xFd84FAac47219D4d04570E0E8762Ea388816ce74";
const contract = new web3.eth.Contract(abi, address);

web3.eth.getAccounts().then(e => {
firstAccount = e[0];
var DoctorList;

contract.methods.get_doctor_list().call().then(result=>{

        DoctorList = result;

        for(var i = 0; i < DoctorList.length; i++) {
            contract.methods.get_doctor(DoctorList[i]).call().then(result=>{

                var list = document.getElementById("permitDoctorList");
                    a = result[0];
                    var option = document.createElement("option");
                    option.text = a;
                    list.appendChild(option);
                     console.log(a);

            });
        }

});

document.getElementById('generate').onclick = function() {
  contract.methods.get_hash(firstAccount).call().then(result =>{
    var hash = result;
    console.log(result);
    for(i = 0; i < result.length; i++){
    var a = document.createElement('iframe');
    a.src = 'https://ipfs.infura.io/ipfs/'+result[i];
    a.title = 'Document'+i;
    var container = document.getElementById('container');
    container.appendChild(a);
    container.appendChild(document.createElement('br'));
  }
  });
}




contract.methods.get_accessed_doctorlist_for_patient(firstAccount).call().then(result =>{

for(i = 0; i< result.length; i++){
  var address = result[i];
  console.log(address);
  contract.methods.get_doctor(result[i]).call().then(res=>{
    $('#accessDoc').append('<tr><td>'+res[0]+'</td><td>'+address+'</td><td><button id = "'+(i-1)+'" class= "revok">Revoke</button></td></tr>');

  });
}
});



$("#giveAccess").click(function() {

    var list = document.getElementById("permitDoctorList");
    index = list.selectedIndex;

    var DoctorList = 0;

    contract.methods.get_doctor_list().call().then(result =>{

            // console.log(index);

            DoctorList = result;
            doctorToBeAdded = DoctorList[index-1];
            contract.methods.permit_access(doctorToBeAdded).send({from: firstAccount})


    });
});




});

$("#profile").click(function(){
  $("#hprofile").show();
  $("#hmd").hide();
  $("#hdoc").hide();
});
$("#med").click(function(){
  $("#hprofile").hide();
  $("#hmd").show();
  $("#hdoc").hide();
});
$("#doc").click(function(){
  $("#hprofile").hide();
  $("#hmd").hide();
  $("#hdoc").show();
});






//console.log('CryptoJS', CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8));

$("#abc").click(function(){
  web3.eth.getAccounts().then(e => {

  firstAccount = e[0];
  var daddr = '0xb29994B93cc258e6f1459EfB12BEDC67D5693ef2';
  contract.methods.revoke_access(daddr).send({from: firstAccount})

});
});
$("#button").click(function() {
  web3.eth.getAccounts().then(e => {

  firstAccount = e[0];
  //var key = 'healthcare';
  //var salt = CryptoJS.lib.WordArray.random(128/8);
	//var iv = CryptoJS.lib.WordArray.random(128/8);
  var file = document.getElementById('file').files[0];
  console.log(file);
      if (file) {
          var reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function(e) {
        //    var encrypted = CryptoJS.AES.encrypt(e.target.result, key, { iv: iv,
              //  mode: CryptoJS.mode.CBC,
            //    padding: CryptoJS.pad.Pkcs7
          //  };

            //var encryptedFile = new File([encrypted], file.name + '.encrypted', {type: file.type, lastModified: file.lastModified});
            //console.log('encryptedFile', encryptedFile);
                try{
                    ipfs.add(e.target.result).then(result=>{
                    console.log(result.path);
                    contract.methods.push_hash(result.path).send({from: firstAccount})
                  });
                } catch(e){
                  console.log("Error: ", e)
                }

          //};
      }
    }
});
});
});
