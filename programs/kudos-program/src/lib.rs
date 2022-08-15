use anchor_lang::prelude::*;

pub use instructions::*;

pub mod instructions;
pub mod state;

declare_id!("FrR535wDsm4PUEU41ipJRMWYJj4bMoQX6GPqiKfQdgzU");

#[program]
pub mod kudos_program {
    use anchor_lang::solana_program::entrypoint::ProgramResult;

    use super::*;

    pub fn create_user_stats(ctx: Context<CreateUserStats>, name: String, pda_bump: u8) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        
        if name.as_bytes().len() > 200 {
            panic!();
        }
        user_stats.init_user_stats(
            name,
            *ctx.accounts.user.key,
            0,
            0,
            pda_bump
        );
        // user_stats.name = name;
        // user_stats.kudos_received = 0;
        // user_stats.kudos_given = 0;
        // user_stats.bump = pda_bump;
        // user_stats.public_key = *ctx.accounts.user.key;
        
        Ok(())
    }

    pub fn give_kudos(ctx: Context<GiveKudos>, amount: u64, ) -> ProgramResult {
        if amount > 10 {
            msg!("Given Kudos too high!! > 10");
            Err(ProgramError::InvalidInstructionData)
        } else {
            ctx.accounts.receiver_stats.kudos_received += amount;
            ctx.accounts.sender_stats.kudos_given += amount;
            Ok(())
        }
    }
}