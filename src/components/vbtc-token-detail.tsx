import { VbtcToken } from "../models/vbtc-token";
import { DetailItem } from "./detail-item";




interface Props {
    token: VbtcToken;
}

export const VbtcTokenDetail = (props: Props) => {
    const { token } = props;

    return <>
        <div className="container">
            <div className="bg-dark p-2">
                <div className="text-center">

                </div>

                <img src={token.image_url} alt={token.name} width={128} height={128} style={{ borderRadius: 64 }} />
                <div className="p-2"></div>

                <div className="d-block d-md-flex justify-start">



                    <DetailItem label="Name" value={token.name}></DetailItem>
                    <div className="p-1"></div>

                    <DetailItem label="Description" value={token.description} ></DetailItem>

                </div>
                <div className="p-1"></div>

                <div className="d-block d-md-flex justify-start">

                    <DetailItem label="Smart Contract ID" value={token.nft.identifier}></DetailItem>
                    <div className="p-1"></div>

                    <DetailItem label="Owner" value={token.owner_address} href={`/search?q=${token.owner_address}`}></DetailItem>
                </div>
                <div className="p-1"></div>
                <div className="p-1"></div>

                <hr />
                <h5>Balances</h5>
                {Object.keys(token.addresses).map((address) => (
                    <div key={address} className="d-block d-md-flex justify-start py-1">
                        <a href={`/search?q=${address}`}>{address}</a>
                        <div className="p-1"></div>
                        <span className="badge bg-primary" style={{ paddingTop: 6 }}>{token.addresses[address]} vBTC</span>
                    </div>
                ))}

                <div className="p-1"></div>


            </div>
        </div>
    </>;
}