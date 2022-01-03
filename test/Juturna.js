const Juturna = artifacts.require("Juturna.sol");

contract("Juturna", (accounts) => {
  let tokenInstance;

  it("initializes the contract with the correct values", () => {
    return Juturna.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then((name) => {
        assert.equal(name, "Juturna", "has the correct name");
        return tokenInstance.symbol();
      })
      .then((symbol) => {
        assert.equal(symbol, "JUT", "has the correct symbol");
        return tokenInstance.standard();
      })
      .then((standard) => {
        assert.equal(standard, "Juturna v1.0", "has the correct standard");
      });
  });

  it("allocates the total supply open deployment", () => {
    return Juturna.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return instance.totalSupply();
      })
      .then((totalSupply) => {
        assert.equal(
          totalSupply.toNumber(),
          1000000,
          "sets the total supply to 1,000,000"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then((adminBalance) => {
        assert.equal(
          adminBalance.toNumber(),
          1000000,
          "it allocates the initial supply to the admin account"
        );
      });
  });

  it("transfers token ownership", () => {
    return Juturna.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.transfer.call(accounts[1], 9999999999999999);
    });
  });
});
