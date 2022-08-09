import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { KudosProgram } from "../target/types/kudos_program";

describe("kudos-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.KudosProgram as Program<KudosProgram>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
