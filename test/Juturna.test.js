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

  it("approves tokens for delegated transfer", async () => {
    const instance = await Juturna.deployed();

    const success = await instance.approve.call(accounts[1], 100);
    assert.equal(success, true, "it returns true");

    try {
      await instance.approve.call(accounts[1], 999999999999999);
    } catch (e) {
      assert(
        e.message.indexOf("revert") >= 0,
        "error message must contain revert"
      );
    }

    const receipt = await instance.approve(accounts[1], 100, {
      from: accounts[0],
    });
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(
      receipt.logs[0].event,
      "Approval",
      'should be the "Approval" event'
    );
    assert.equal(
      receipt.logs[0].args._owner,
      accounts[0],
      "logs the account the tokens are authorized by"
    );
    assert.equal(
      receipt.logs[0].args._spender,
      accounts[1],
      "logs the account the tokens are approved for"
    );
    assert.equal(receipt.logs[0].args._value, 100, "logs the approved amount");

    const allowance = await instance.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 100, "stores the allowance");

    return instance;
  });

  it("handles delegated token transfers", async () => {
    const instance = await Juturna.deployed();
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spender = accounts[4];

    // Transfer some tokens to fromAccount
    await instance.transfer(fromAccount, 100, {
      from: accounts[0],
    });

    // Approve spender to spend 10 tokens from fromAccount
    await instance.approve(spender, 10, { from: fromAccount });

    // Try transferring something larger than the sender's balance
    try {
      await instance.transferFrom(fromAccount, toAccount, 9999, {
        from: spender,
      });
    } catch (e) {
      assert(
        e.message.indexOf("revert") >= 0,
        "cannot transfer value larger than balance"
      );
    }

    // Try transferring something larger than the approved amount
    try {
      await instance.transferFrom(fromAccount, toAccount, 20, {
        from: spender,
      });
    } catch (e) {
      assert(
        e.message.indexOf("revert") >= 0,
        "cannot transfer value larger than approved amount"
      );
    }

    // Confirm successful transfer
    const success = await instance.transferFrom.call(
      fromAccount,
      toAccount,
      10,
      {
        from: spender,
      }
    );
    assert.equal(success, true, "transfer successul");

    // Transfer 10 tokens to toAccount using fromAccount's approved spender
    const receipt = await instance.transferFrom(fromAccount, toAccount, 10, {
      from: spender,
    });
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(
      receipt.logs[0].event,
      "Transfer",
      'should be the "Transfer" event'
    );
    assert.equal(
      receipt.logs[0].args._from,
      fromAccount,
      "logs the account the tokens are transferred from"
    );
    assert.equal(
      receipt.logs[0].args._to,
      toAccount,
      "logs the account the tokens are transferred to"
    );
    assert.equal(receipt.logs[0].args._value, 10, "logs the transfer amount");

    const balance = await instance.balanceOf(toAccount);
    assert.equal(
      balance.toNumber(),
      10,
      "adds the amount to the receiving account"
    );

    const senderBalance = await instance.balanceOf(fromAccount);
    assert.equal(
      senderBalance.toNumber(),
      90,
      "deducts the amount from the sending account"
    );
  });
});
