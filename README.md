# Kudos Program

A smart contract for the Solana blockchain to let wallets send each other kudos.


## Features
- [x] Let user initialize their kudos account.
- [x] Wallets can send other wallets kudos but not their own wallet.
- [x] Let user update their name.
- [x] Let user close their account.

## Instructions
- Create Account
    - Initializes a new user account with
        - Version (hardcoded)
        - Name (Of the user)
        - Public Key of associated wallet
        - Kudos Received (zeroed)
        - Kudos Given (zeroed)
        - Bump (PDA bump)
- Update Name
    - Update the user name associated with the account.
- Delete Account
    - Deletes the user's account.
- Give Kudos
    - Give another account Kudos

## Links
- [Frontend Code](https://github.com/RationalAsh/kudos-program-ui)
- [Frontend Deployed](https://www.ashwinnarayan.com/dapps/kudos-program/)
