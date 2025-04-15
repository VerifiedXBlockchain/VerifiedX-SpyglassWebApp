import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Adnr } from "../models/adnr";
import { Block } from "../models/block";
import { Nft } from "../models/nft";
import { Validator } from "../models/validator";
import { AdnrService } from "../services/adnr-service";
import { BlockService } from "../services/block-service";
import { NftService } from "../services/nft-service";
import { ValidatorService } from "../services/validator-service";
import { BlockList } from "./block-list";
import { NftCardList } from "./nft-list";
import { ValidatorCardList } from "./validator-card-list";
import { ValidatorList } from "./validator-list";
import { AddressService } from "../services/address-service";
import { TopHolder } from "../models/address";

export const TopHoldersList = () => {
    const [results, setResults] = useState<TopHolder[]>([]);

    const fetch = async () => {
        const service = new AddressService();
        try {

            const data = await service.topHolders();

            setResults(data);

        } catch (e) {
            console.log(e);

        }
    };

    useEffect(() => {
        fetch();
    }, [])



    return (
        <div>
            <div className="container">



                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Address</th>
                            <th scope="col" className="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result.address}>

                                <td style={{ verticalAlign: 'middle' }}>
                                    <a href={`/search?q=${result.address}`}>{result.address}</a>
                                </td>
                                <td className="text-end " style={{ fontFamily: 'monospace' }}>{result.balance} VFX</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        </div>

    );
};
