import { FungibleToken } from "../models/fungible-token";
import { VbtcToken } from "../models/vbtc-token";
import { DetailItem } from "./detail-item";




interface Props {
    token: FungibleToken;
    holders: { [key: string]: number }
}

export const FungibleTokenDetail = (props: Props) => {
    const { token, holders } = props;

    return <>
        <div className="container">
            <div className="bg-dark p-2">
                <div className="text-center">

                </div>

                {token.nsfw ? <div style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: "#aaaaaa" }}></div> : <img src={token.image_url} alt={token.name} width={128} height={128} style={{ borderRadius: 64 }} />}
                <div className="p-2"></div>

                <div className="d-block d-md-flex justify-start">



                    <DetailItem label="Name" value={token.name}></DetailItem>
                    <div className="p-1"></div>

                    <DetailItem label="Ticker" value={token.ticker} ></DetailItem>

                </div>
                <div className="p-1"></div>

                <div className="d-block d-md-flex justify-start">

                    <DetailItem label="Smart Contract ID" value={token.sc_identifier}></DetailItem>
                    <div className="p-1"></div>

                    <DetailItem label="Owner" value={token.owner_address} href={`/search?q=${token.owner_address}`}></DetailItem>
                </div>
                <div className="p-1"></div>


                <div className="d-block d-md-flex justify-start">

                    <DetailItem label="Circulating Supply" value={`${token.circulating_supply} ${token.ticker}`}></DetailItem>
                    <div className="p-1"></div>
                    <DetailItem label="Mintable" value={token.can_mint ? "Yes" : "No"} ></DetailItem>
                    <div className="p-1"></div>
                    <DetailItem label="Burnable" value={token.can_burn ? "Yes" : "No"} ></DetailItem>
                    <div className="p-1"></div>
                    <DetailItem label="Supports Voting" value={token.can_vote ? "Yes" : "No"} ></DetailItem>
                </div>



                <div className="p-1"></div>
                <div className="p-1"></div>

                <hr />
                <h5>Balances</h5>
                {Object.keys(holders).map((address) => (
                    <div key={address} className="d-block d-md-flex justify-start py-1">
                        <a href={`/search?q=${address}`}>{address}</a>
                        <div className="p-1"></div>
                        <span className="badge bg-primary" style={{ paddingTop: 6 }}>{holders[address]} {token.ticker}</span>
                    </div>
                ))}

                <div className="p-1"></div>


            </div>
        </div>
    </>;
}