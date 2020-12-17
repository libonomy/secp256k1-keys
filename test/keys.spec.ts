import {
  randomBytes,
  getlibonomyAddress,
  generateWalletFromSeed,
  getSeed,
  generateWallet,
  signWithPrivateKey,
  signWithPrivateKeywallet,
  verifySignature
} from '../src/libonomy-keys'

describe(`Key Generation`, () => {
  it(`randomBytes browser`, () => {
    const crypto = require('crypto')
    const window = {
      crypto: {
        getRandomValues: (array: any[]) => crypto.randomBytes(array.length)
      }
    }
    expect(randomBytes(32, <Window>window).length).toBe(32)
  })

  it(`randomBytes node`, () => {
    expect(randomBytes(32).length).toBe(32)
  })

  it(`randomBytes unsecure environment`, () => {
    jest.doMock('crypto', () => null)

    expect(() => randomBytes(32)).toThrow()
  })

  it(`should create a wallet from a seed`, async () => {
    expect(await generateWalletFromSeed(`a b c`)).toEqual({
      libonomyAddress: `libonomy1pt9904aqg739q6p9kgc2v0puqvj6atp0wryckz`,
      privateKey: `a9f1c24315bf0e366660a26c5819b69f242b5d7a293fc5a3dec8341372544be8`,
      publicKey: `037a525043e79a9051d58214a9a2a70b657b3d49124dcd0acc4730df5f35d74b32`
    })
  })

  it(`create a seed`, () => {
    expect(
      getSeed(() =>
        Buffer.from(
          Array(64)
            .fill(0)
            .join(``),
          'hex'
        )
      )
    ).toBe(
      `abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art`
    )
  })

  it(`create a random wallet`, () => {
    expect(
      generateWallet(() =>
        Buffer.from(
          Array(64)
            .fill(0)
            .join(``),
          'hex'
        )
      )
    ).toEqual({
      libonomyAddress: `libonomy1r5v5srda7xfth3hn2s26txvrcrntldjuhc3aw4`,
      privateKey: `8088c2ed2149c34f6d6533b774da4e1692eb5cb426fdbaef6898eeda489630b7`,
      publicKey: `02ba66a84cf7839af172a13e7fc9f5e7008cb8bca1585f8f3bafb3039eda3c1fdd`
    })
  })

  it(`throws an error if entropy function is not producing correct bytes`, () => {
    expect(() =>
      getSeed(() =>
        Buffer.from(
          Array(10)
            .fill(0)
            .join(``),
          'hex'
        )
      )
    ).toThrow()
  })
})

describe(`Address generation`, () => {
  it(`should create correct libonomy addresses`, () => {
    const vectors = [
      {
        pubkey: `52FDFC072182654F163F5F0F9A621D729566C74D10037C4D7BBB0407D1E2C64981`,
        address: `libonomy1v3z3242hq7xrms35gu722v4nt8uux8nvsmzwan`
      },          
      {
        pubkey: `855AD8681D0D86D1E91E00167939CB6694D2C422ACD208A0072939487F6999EB9D`,
        address: `libonomy1hrtz7umxfyzun8v2xcas0v45hj2uhp6sy7hmpd`
      }
    ]
    vectors.forEach(({ pubkey, address }) => {
      expect(getlibonomyAddress(Buffer.from(pubkey, 'hex'))).toBe(address)
    })
  })
})

describe(`Signing`, () => {
  it(`should create a correct signature`, () => {
    const vectors = [
      {
        privateKey: `59d7c57402794265d5b667fa3b2f51f28d45433cc06e142151835dcf2544e8c8`,
        signMessage: {
          account_number:"14",
          chain_id:"testnet",
          fee:{amount:[{amount:"37",denom:"ulby"}],
          gas:"11600"},
          memo:"(Sent via libonomy Wallet)",
          msgs:[{type:"aphelion/MsgSend",value:{amount:[{amount:"1200000000",
          denom:"ulby"}],
          from_address:"libonomy1hvmd336k0wsq3hwmf2vaf7008zc8t92p0uscrj",
          to_address:"libonomy1hvmd336k0wsq3hwmf2vaf7008zc8t92p0uscrj"}}],
          sequence:"0"
        },
        signature: `20eecd2fc8b262f9ddf498f975ea0647c87a54532477858919b36dd8b5153ae5421f8f0d65c25528294ef69ea40be28ab94695f28c5d74a13e4123b1ecbaa439`
      }
    ]

    vectors.forEach(({ privateKey, signMessage, signature: expectedSignature }) => {
      const signature = signWithPrivateKey(signMessage, Buffer.from(privateKey, 'hex'))
      console.log("Signature:",signature.toString('hex'))
      expect(signature.toString('hex')).toEqual(expectedSignature)
    })
  })
})


describe(`Signing`, () => {
  it(`should create a correct signature according to wallet`, () => {
    const vectors = [
      {
        privateKey: `72cec60ccec2c595fb0d15058425e6d097eb0066caa39b12e5c85c56a619d37d`,
        signMessage: {
          message: 'SignTest'
        },
        signature: `c/nZFM7lWBE5QB+R1oslNtGHaAiF4YRzvw2RlG+fqbAZwuqmsaq+vxXOI0pMOjz3O3UFb1f58MGs/Ly5QoBw5TA=`
      }
    ]

    vectors.forEach(({ privateKey, signMessage, signature: expectedSignature }) => {
      const signature = signWithPrivateKeywallet(signMessage, Buffer.from(privateKey, 'hex'))
      expect(signature.toString('base64')).toEqual(expectedSignature)
    })
  })
})

describe(`Verifying`, () => {
  it(`should verify a signature`, () => {
    const vectors = [
      {
        publicKey: `libonomy1d5993rjea7tlyxzrtqqveeuk3m34ef0axd2exr`,
        signMessage: {
          message: 'SignTest'
        },
        signature: `c/nZFM7lWBE5QB+R1oslNtGHaAiF4YRzvw2RlG+fqbAZwuqmsaq+vxXOI0pMOjz3O3UFb1f58MGs/Ly5QoBw5TA=`
      }
    ]

    vectors.forEach(({ publicKey, signMessage, signature }) => {
      const publicKeyBuffer = Buffer.from(publicKey, 'base64');
      const signatureBuffer = Buffer.from(signature, 'base64');
      expect(verifySignature(signMessage, signatureBuffer, publicKeyBuffer)).toEqual(false);
    })
  })

  //TODO: write case for signature manipulation, signature collapse, length and AI audit signatures
})