const dflix = artifacts.require("dflix");

module.exports = function(deployer) {
  const poolAddress = ""; // <-- replace with the actual pool address
  deployer.deploy(dflix, poolAddress);
};