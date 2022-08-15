use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct UpdateName<'info> {
    #[account(mut)]
    pub user: Signer<'info>, // User has to sign.

    #[account(
        mut,
        seeds = [SEED_PHRASE, user.key().as_ref()],
        bump = user_stats.bump
    )]
    pub user_stats: Account<'info, UserStats>,
}