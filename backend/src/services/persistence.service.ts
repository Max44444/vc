import Datastore from "nedb";

type CertificateData = {
    tokenId: string,
    certificateCid: string
}

type IssuerData = {
    id: string,
    name: string,
    email: string,
    description: string,
    active: boolean,
    certificates: CertificateData[]
}

export class PersistenceService {

    private db: Datastore

    constructor() {
        this.db = new Datastore({filename: 'issuers.db', autoload: true})
    }

    add(id: string, name: string, email: string, description: string): Promise<IssuerData> {
        return new Promise((resolve, reject) => {
            const entity: IssuerData = {
                id,
                name,
                email,
                description,
                active: true,
                certificates: []
            };

            this.db.insert(entity, (err, newDoc) => {
                if (err) reject(err);
                else resolve(newDoc);
            });
        });
    }

    deleteByCid(issuerCid: string) {
        return new Promise((resolve, reject) => {
            this.db.remove({ id: issuerCid }, {}, (err, numRemoved) => {
                if (err) reject(err);
                else resolve(numRemoved);
            });
        });
    }

    getByCid(issuerCid: string): Promise<IssuerData | undefined> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ id: issuerCid }, (err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
        });
    }

    addCertificate(issuerCid: string, tokenId: string, certificateCid: string) {
        return new Promise((resolve, reject) => {
            this.db.update(
                {id: issuerCid},
                {$addToSet: {certificates: { tokenId, certificateCid }}},
                {},
                (err, numUpdated) => {
                    if (err) reject(err);
                    else resolve(numUpdated);
                }
            );
        })
    }

}