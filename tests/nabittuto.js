const anchor = require('@project-serum/anchor');
const assert = require('assert');
const { SystemProgram } = anchor.web3;

describe('nabittuto', () => {
  // create provide
  const provider = anchor.Provider.env();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);
  // create program
  const program = anchor.workspace.Nabittuto;

  // test if create a counter
  it('Creates a counter', async () => {
    // call the create func via RPC
    // generate an accounbt
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    /*Fetch the account and check value of count */
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey,
    );
    console.log('Count 0:', account.count.toString());
    assert.ok(account.count.toString() == 0);
    _baseAccount = baseAccount;
  });

  /* test if Increment */
  it('Increments the counter', async () => {
    const baseAccount = _baseAccount;

    //  call the function RPC
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    // get account
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey,
    );
    console.log('Count 1: ', account.count.toString());
    assert.ok(account.count.toString() == 1);
  });
});
