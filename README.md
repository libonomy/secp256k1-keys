# Overview

It should be acknowledged that the libraries that your are going to be interacting with are just the
application level implementation with similar standards. Libonomy shouldnt be confused with
COSMOS, Polkadot,Ethereum or others.

As the consensus run by libonomy is Aphelion: AI based protocol in its initial Coin Support with
staking systems i.e DPOS(Tendermint), POS.

Aphelion runs multiple pooling networks within its AI core so its strongly recommended when
exploring the system you utilize the relevant pool or keep your self updated with our github or
educate yourself through our whitepaper or development team.

@libonomy/secp256k1-keys is based on elliptic curve cryptography is used for generating
keypairs,message signing and bech32prefix addressed standard followed commonly
by blockchains.

This library gives the ability for offline message signing with the relevant private key and than
broadcasting the signed transaction using the RPC or REST calls

Note: The library is compatible/can be integrated with any JS implementation of frontend/backend.
This library deals with tasks that are considered *security-critical* and should be used very carefully.

## Usage
The examples of using the library are given below.

### Create a wallet

```js
import { generateWallet } from "@libonomy/secp256k1-keys"

const { libonomyAddress, privateKey, publicKey } = generateWallet()
// Attention: protect the `privateKey` at all cost and never display it anywhere!!
```

### Generating the wallet with key pairs

```js
//import the generate wallet function
import { generateWallet } from "@libonomy/secp256k1-keys"
//extract the necessary usage keys
const { libonomyAddress, privateKey, publicKey } = generateWallet() 
// Attention: protect the `privateKey` at all cost and never display it anywhere!!
```

### Import a seed for generating wallet

```js
import { generateWalletFromSeed } from "@libonomy/secp256k1-keys"
//generate the 24 byte length seed phrase or translate it to mnemonic using mnemonic translater
const seed = ...24 byte seed phrase
//bech32prefix is being used in libonomy for easily moving assets between different sidechains
const bech32prefix = 'libonomy';
const { libonomyAddress, privateKey, publicKey } = generateWalletFromSeed(seed, bech32prefix)

```

### Transaction Signing

```js
//import the function to sign the message with the private key
import { signWithPrivateKey } from "@libonomy/secp256k1-keys"
//drive the private keyconst privateKey = Buffer.from(...)
//create the message for signing it with the private key
//you can see different rpc messages examples and sign with the private keys
const signMessage =
{
account_number:"0",
chain_id:"main-beta-v1",
fee:{amount:[{amount:"37",denom:"ulby"}],
gas:"11600"},
memo:"(test beta transaction)",
msgs:[{type:"aphelion/MsgSend",value:{amount:[{amount:"1900000000",
denom:"ulby"}],
from_address:"libonomy89olempempp92x9hyzz**********",
to_address:"libonomy89olempempp92x9hyzz**********"}}],
sequence:"0"
},
//Sign the message
const signature = signWithPrivateKey(signMessage, privateKey)

```
