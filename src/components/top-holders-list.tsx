import { useEffect, useState } from "react";
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
                            <th scope="col">Domain</th>
                            <th scope="col" className="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result.address}>

                                <td style={{ verticalAlign: 'middle' }}>
                                    <a href={`/search?q=${result.address}`}>{result.address}</a>
                                </td>
                                <td className="" style={{ fontFamily: 'monospace' }}>{result.adnr || ''} </td>

                                <td className="text-end " style={{ fontFamily: 'monospace' }}>{result.balance} VFX</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        </div>

    );
};
