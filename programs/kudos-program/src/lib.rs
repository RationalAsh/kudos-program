use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod kudos_program {
    use super::*;

    pub fn create_user_stats(ctx: Context<CreateUserStats>, name: String, pda_bump: u8) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        
        if name.as_bytes().len() > 200 {
            panic!();
        }

        user_stats.name = name;
        user_stats.kudos = 0;
        user_stats.bump = pda_bump;
        
        Ok(())
    }

    pub fn give_kudos(ctx: Context<GiveKudos>, amount: u64) -> Result<()> {
        ctx.accounts.user_stats.kudos += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct UserStats {
    name: String,
    kudos: u64,
    bump: u8
}

#[derive(Accounts)]
pub struct CreateUserStats<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    // Space: 8 discriminator + 64 name + 8 kudos + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 64 + 8 + 1,
        seeds = [b"user-stats", user.key().as_ref()],
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
    #[account(mut)]
    pub kudos_receiver: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"user-stats", kudos_receiver.key().as_ref()],
        bump = user_stats.bump
    )]
    pub user_stats: Account<'info, UserStats>,
}