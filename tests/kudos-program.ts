import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { KudosProgram } from "../target/types/kudos_program";
import fs from 'fs'
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';


const SEED_PHRASE = "kudos-stats"

describe("kudos-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.KudosProgram as Program<KudosProgram>;

  // Load local test wallet.
  const kps = fs.readFileSync("/Users/ashwin/.config/solana/id.json", {encoding: 'utf-8'});
  const kpb = Buffer.from(JSON.parse(kps));
  const userWallet = Keypair.fromSecretKey(kpb);

  // Coleague's wallet
  const colleagueWallet = Keypair.generate();


  it("Set up wallets with enough SOL.", async () => {
    const airdropSig1 = await provider.connection.requestAirdrop(
      colleagueWallet.publicKey,
      2e9
    );

    console.log("Airdrop completed. Signature: ", airdropSig1);
    const airdropSig2 = await provider.connection.requestAirdrop(
      userWallet.publicKey,
      2e9
    );
    console.log("Airdrop completed. Signature: ", airdropSig2);
  });
  

  it("Initializes Kudos Account for receiver.", async () => {
    // Create a PDA
    const [userStatsPDA, pda_bump] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode(SEED_PHRASE),
        userWallet.publicKey.toBuffer() ],
        program.programId
    )

    // Add your test here.
    const tx = await program.methods
        .createUserStats("Ashwin", pda_bump)
        .accounts({
          user: userWallet.publicKey,
          userStats: userStatsPDA,
          systemProgram: SystemProgram.programId
        })
        .signers([userWallet])
        .rpc();
    console.log("Your transaction signature", tx);
    const res = await program.account.userStats.fetch(userStatsPDA);
    console.log(res)
  });

  it("Initializes Kudos Account for sender.", async () => {
    // Create a PDA
    const [senderStatsPDA, pda_bump_sender] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode(SEED_PHRASE),
        colleagueWallet.publicKey.toBuffer() ],
        program.programId
    )

    // Add your test here.
    const tx = await program.methods
        .createUserStats("Sender", pda_bump_sender)
        .accounts({
          user: colleagueWallet.publicKey,
          userStats: senderStatsPDA,
          systemProgram: SystemProgram.programId
        })
        .signers([colleagueWallet])
        .rpc();
    console.log("Your transaction signature", tx);
    const res = await program.account.userStats.fetch(senderStatsPDA);
    console.log(res)
  });

  it("Give Kudos", async () => {
    // Create a PDA
    const [userStatsPDA, pda_bump_user] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode(SEED_PHRASE),
        userWallet.publicKey.toBuffer() ],
        program.programId
    )

    const [senderStatsPDA, pda_bump_sender] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode(SEED_PHRASE),
        colleagueWallet.publicKey.toBuffer() ],
        program.programId
    )

    // Add your test here.
    const tx = await program.methods
        .giveKudos(new anchor.BN(10))
        .accounts({
          kudosSender: colleagueWallet.publicKey,
          kudosReceiver: userWallet.publicKey,
          receiverStats: userStatsPDA,
          senderStats: senderStatsPDA
        })
        .signers([colleagueWallet])
        .rpc();
    console.log("Your transaction signature", tx);
    const res1 = await program.account.userStats.fetch(senderStatsPDA);
    const res2 = await program.account.userStats.fetch(userStatsPDA);
    console.log(res1);
    console.log(res2);
  });

  it("Error if someone tries to send themselves kudos", async () => {
    // Create a PDA
    const [userStatsPDA, pda_bump] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode(SEED_PHRASE),
        userWallet.publicKey.toBuffer() ],
        program.programId
    )

    // Add your test here.
    const tx = await program.methods
        .giveKudos(new anchor.BN(20))
        .accounts({
          kudosSender: userWallet.publicKey,
          kudosReceiver: userWallet.publicKey,
          receiverStats: userStatsPDA,
          senderStats: userStatsPDA
        })
        .signers([userWallet])
        .rpc()
        .catch((err) => {
          console.log(err);
          // No need to do anything
        });
    console.log("Your transaction signature", tx);
    // const res1 = await program.account.userStats.fetch(senderStatsPDA);
    const res2 = await program.account.userStats.fetch(userStatsPDA);
    // console.log(res1);
    console.log(res2);
  });

  it("Error if too many Kudos given at once", async () => {
    // Create a PDA
    const [userStatsPDA, pda_bump] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode(SEED_PHRASE),
        userWallet.publicKey.toBuffer() ],
        program.programId
    )

    const [senderStatsPDA, pda_bump_sender] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode(SEED_PHRASE),
        colleagueWallet.publicKey.toBuffer() ],
        program.programId
    )

    // Add your test here.
    const tx = await program.methods
        .giveKudos(new anchor.BN(20))
        .accounts({
          kudosSender: colleagueWallet.publicKey,
          kudosReceiver: userWallet.publicKey,
          receiverStats: userStatsPDA,
          senderStats: senderStatsPDA
        })
        .signers([colleagueWallet])
        .rpc()
        .catch((err) => {
          // console.log(err);
          // No need to do anything
        });
    console.log("Your transaction signature", tx);
    const res1 = await program.account.userStats.fetch(senderStatsPDA);
    const res2 = await program.account.userStats.fetch(userStatsPDA);
    console.log(res1);
    console.log(res2);
  });

  it("Checking if PDAs can be found.", async () => {
    const paccs = await provider.connection.getProgramAccounts(
      new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")
    )
    paccs?.forEach((item, index) => {
      console.log("----------------");
      console.log("Account %d", 1);
      console.log("----------------");
      console.log("Address : ", item.pubkey.toBase58());
      console.log("Owner   : ", item.account.owner.toBase58());
      console.log("Data    : %d bytes.", item.account.data.length);
      console.log("----------------\n");
    })
  })
});
