const Juturna = artifacts.require("Juturna.sol");

contract("Juturna", (accounts) => {
  it("initializes the contract with the correct values", async () => {
    const instance = await Juturna.deployed();

    const name = await instance.name();

    assert.equal(name, "Juturna", "name is correct");

    const symbol = await instance.symbol();

    assert.equal(symbol, "JUT", "symbol is correct");

    const standard = await instance.standard();

    assert.equal(standard, "Juturna v1.0", "standard is correct");

    return instance;
  });

  it("allocates the total supply open deployment", async () => {
    const instance = await Juturna.deployed();

    const totalSupply = await instance.totalSupply();

    assert.equal(totalSupply.toNumber(), 1000000, "total supply is correct");

    const adminBalance = await instance.balanceOf(accounts[0]);

    assert.equal(adminBalance.toNumber(), 1000000, "admin balance is correct");

    return instance;
  });

  it("transfers token ownership", async () => {
    const instance = await Juturna.deployed();

    const success = await instance.transfer.call(accounts[1], 250000, {
      from: accounts[0],
    });

    assert.equal(success, true, "it returns true");

    try {
      await instance.transfer.call(accounts[1], 999999999999999);
    } catch (e) {
      assert(
        e.message.indexOf("revert") >= 0,
        "error message must contain revert"
      );
    }

    const receipt = await instance.transfer(accounts[1], 250000, {
      from: accounts[0],
    });

    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(
      receipt.logs[0].event,
      "Transfer",
      'should be the "Transfer" event'
    );
    assert.equal(
      receipt.logs[0].args._from,
      accounts[0],
      "logs the account the tokens are transferred from"
    );
    assert.equal(
      receipt.logs[0].args._to,
      accounts[1],
      "logs the account the tokens are transferred to"
    );
    assert.equal(
      receipt.logs[0].args._value,
      250000,
      "logs the transfer amount"
    );

    const balance = await instance.balanceOf(accounts[1]);

    assert.equal(
      balance.toNumber(),
      250000,
      "adds the amount to the receiving account"
    );

    const senderBalance = await instance.balanceOf(accounts[0]);

    assert.equal(
      senderBalance.toNumber(),
      750000,
      "deducts the amount from the sending account"
    );

    return instance;
  });
});
