import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { KudosProgram } from "../target/types/kudos_program";
import fs from 'fs'
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';

describe("kudos-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.KudosProgram as Program<KudosProgram>;

  // Load local test wallet.
  const kps = fs.readFileSync("/Users/ashwin/.config/solana/id.json", {encoding: 'utf-8'});
  const kpb = Buffer.from(JSON.parse(kps));
  const userWallet = Keypair.fromSecretKey(kpb);

  // Coleague's wallet
  const colleagueWallet = Keypair.generate();

  it("Initializes Kudos Account", async () => {
    // Create a PDA
    const [userStatsPDA, pda_bump] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode("user-stats"),
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

  it("Give Kudos", async () => {
    // Create a PDA
    const [userStatsPDA, pda_bump] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode("user-stats"),
        userWallet.publicKey.toBuffer() ],
        program.programId
    )

    // Add your test here.
    const tx = await program.methods
        .giveKudos(new anchor.BN(10))
        .accounts({
          kudosSender: colleagueWallet.publicKey,
          kudosReceiver: userWallet.publicKey,
          userStats: userStatsPDA
        })
        .signers([colleagueWallet])
        .rpc();
    console.log("Your transaction signature", tx);
    const res = await program.account.userStats.fetch(userStatsPDA);
    console.log(res)
  });

  it("Error if too many Kudos given at once", async () => {
    // Create a PDA
    const [userStatsPDA, pda_bump] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode("user-stats"),
        userWallet.publicKey.toBuffer() ],
        program.programId
    )

    // Add your test here.
    const tx = await program.methods
        .giveKudos(new anchor.BN(20))
        .accounts({
          kudosSender: colleagueWallet.publicKey,
          kudosReceiver: userWallet.publicKey,
          userStats: userStatsPDA
        })
        .signers([colleagueWallet])
        .rpc()
        .catch((err) => {
          // console.log(err);
          // No need to do anything
        });
    console.log("Your transaction signature", tx);
    const res = await program.account.userStats.fetch(userStatsPDA);
    console.log(res)
  });
});
