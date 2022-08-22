use anchor_lang::prelude::*;

pub const SEED_PHRASE: &[u8] = b"kudos-stats-v0.2";

#[account]
pub struct UserStats {
    pub name: String,         // Name of the registered user.
    pub public_key: Pubkey,   // Public key of the registered user's wallet.
    pub kudos_received: u64,  // Kudos received by the registered user.
    pub kudos_given: u64,     // Kudos given to other accounts by the registered user.
    pub bump: u8              // Account bump for the PDA.
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

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn receive_kudos(&mut self, kudos: u64) {
        self.kudos_received += kudos;
    }

    pub fn give_kudos(&mut self, kudos: u64) {
        self.kudos_given += kudos;
    }
}

