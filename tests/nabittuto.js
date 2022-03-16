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
  it('initialize the account', async () => {
    // call the create func via RPC
    // generate an accounbt
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.initialize('Hello word web3', {
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
    console.log('Data:', account.data);
    assert.ok(account.data === 'Hello word web3');
    _baseAccount = baseAccount;
  });

  /* test if update */
  it('Updates a previously created account', async () => {
    const baseAccount = _baseAccount;

    //  call the function RPC
    await program.rpc.update('everything is okay', {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    // get account
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey,
    );
    console.log('Updated Data: ', account.data);
    assert.ok(account.data === 'everything is okay');
    console.log('All account data ', account);
    console.log('All  data ', account.dataList);
    assert.ok(account.dataList.length === 2);
  });
});
