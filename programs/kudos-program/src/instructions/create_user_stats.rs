use anchor_lang::prelude::*;

use crate::state::*;

// The context in which the create_user_stats instruction runs.
#[derive(Accounts)]
pub struct CreateUserStats<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    // Space:   8 discriminator 
    //        + 64 name
    //        + 32 public key 
    //        + 8 kudos tx 
    //        + 8 kudos rx 
    //        + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 64 + 32 + 8 + 8 + 1,
        seeds = [SEED_PHRASE, user.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    pub system_program: Program<'info, System>,
}