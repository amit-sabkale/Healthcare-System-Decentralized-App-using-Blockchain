const Role = artifacts.require("Role");

module.exports = function(deployer) {
  deployer.deploy(Role);
};
