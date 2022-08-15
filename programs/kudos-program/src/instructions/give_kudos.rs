use anchor_lang::prelude::*;

use crate::state::*;

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