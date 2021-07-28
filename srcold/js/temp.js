var $ = require("jquery");
const HummusRecipe = require('hummus-recipe');

const ipfsClient = require("ipfs-http-client");
const ipfs = new ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol:'https'});
$( document ).ready(function() {
$("#button").click(function() {
  var file = document.getElementById('name').files[0];
console.log(file);
      if (file) {
        const pdfDoc = new HummusRecipe(file, 'output.pdf');

        pdfDoc
            .encrypt({
                userPassword: $("#password").val(),
                ownerPassword: $("#password").val(),
                userProtectionFlag: 4
            })
            .endPDF();
}
});
});
