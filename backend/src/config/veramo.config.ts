import type { ICredentialPlugin, IDataStore, IDIDManager, IKeyManager, IResolver } from '@veramo/core'
import { createAgent } from '@veramo/core'
import { CredentialPlugin } from '@veramo/credential-w3c'
// import { CredentialIssuerLD, LdDefaultContexts, VeramoEd25519Signature2018 } from '@veramo/credential-ld'
import { DIDManager } from '@veramo/did-manager'
import { KeyDIDProvider } from '@veramo/did-provider-key'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager } from '@veramo/key-manager'
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
import { DIDStore, Entities, KeyStore, migrations, PrivateKeyStore } from '@veramo/data-store'
import { DataSource } from 'typeorm'
import { Resolver } from 'did-resolver'
import { getResolver as getKeyResolver } from 'key-did-resolver'

const dbConnection = new DataSource({
    type: 'sqlite',
    database: './database.sqlite',
    synchronize: true,
    logging: false,
    entities: Entities,
    migrations: migrations,
}).initialize()

const didKeyResolver = getKeyResolver()

export const agent = createAgent<IDIDManager & IKeyManager & IResolver & ICredentialPlugin & IDataStore>({
    plugins: [
        new KeyManager({
            store: new KeyStore(dbConnection),
            kms: {
                local: new KeyManagementSystem(
                    new PrivateKeyStore(dbConnection, new SecretBox('29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'))
                ),
            },
        }),

        new DIDManager({
            store: new DIDStore(dbConnection),
            defaultProvider: 'did:key',
            providers: {
                'did:key': new KeyDIDProvider({
                    defaultKms: 'local',
                }),
            },
        }),

        new DIDResolverPlugin({
            resolver: new Resolver({
                ...didKeyResolver,
            }),
        }),

        new CredentialPlugin(),
    ],
})
