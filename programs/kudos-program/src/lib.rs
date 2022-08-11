use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const SEED_PHRASE: &[u8] = b"kudos-stats";

#[program]
pub mod kudos_program {
    use anchor_lang::solana_program::entrypoint::ProgramResult;

    use super::*;

    pub fn create_user_stats(ctx: Context<CreateUserStats>, name: String, pda_bump: u8) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        
        if name.as_bytes().len() > 200 {
            panic!();
        }

        user_stats.name = name;
        user_stats.kudos_received = 0;
        user_stats.kudos_given = 0;
        user_stats.bump = pda_bump;
        
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

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct UserStats {
    name: String,
    kudos_received: u64,
    kudos_given: u64,
    bump: u8
}

#[derive(Accounts)]
pub struct CreateUserStats<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    // Space: 8 discriminator + 64 name + 8 kudos tx + 8 kudos rx + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 64 + 8 + 8 + 1,
        seeds = [SEED_PHRASE, user.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GiveKudos<'info> {
    #[account(mut)]
    pub kudos_sender: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(
        mut,
        constraint = kudos_sender.to_account_info().key() != kudos_receiver.key() // Don't allow people to send themselves kudos.
    )]
    pub kudos_receiver: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [SEED_PHRASE, kudos_receiver.key().as_ref()],
        bump = receiver_stats.bump
    )]
    pub receiver_stats: Account<'info, UserStats>,

    #[account(
        mut,
        seeds = [SEED_PHRASE, kudos_sender.key().as_ref()],
        bump = sender_stats.bump
    )]
    pub sender_stats: Account<'info, UserStats>,
}