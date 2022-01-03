const Juturna = artifacts.require("Juturna");

module.exports = function (deployer) {
  deployer.deploy(Juturna, 1000000);
};
