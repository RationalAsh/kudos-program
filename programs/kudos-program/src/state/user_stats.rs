use anchor_lang::prelude::*;

#[account]
pub struct UserStats {
    name: String,         // Name of the registered user.
    public_key: Pubkey,   // Public key of the registered user's wallet.
    kudos_received: u64,  // Kudos received by the registered user.
    kudos_given: u64,     // Kudos given to other accounts by the registered user.
    bump: u8              // Account bump for the PDA.
}

impl UserStats {
    pub fn init_user_stats(
        &mut self,
        name: String,
        public_key: Pubkey,
        kudos_received: u64,
        kudos_given: u64,
        bump: u8
    ) {
        self.name = name;
        self.public_key = public_key;
        self.kudos_received = kudos_received;
        self.kudos_given = kudos_given;
        self.bump = bump
    }
}

