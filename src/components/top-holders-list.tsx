import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useLocalized } from "../utils/use-localized";
import { AddressService } from "../services/address-service";
import { TopHolder } from "../models/address";

export const TopHoldersList = () => {
    const { t } = useTranslation("search");
    const localized = useLocalized();
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
                            <th scope="col">{t("topHolders.table.address")}</th>
                            <th scope="col">{t("topHolders.table.domain")}</th>
                            <th scope="col" className="text-end">{t("topHolders.table.balance")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result.address}>

                                <td style={{ verticalAlign: 'middle' }}>
                                    <a href={localized(`/search?q=${result.address}`)}>{result.address}</a>
                                </td>
                                <td className="" style={{ fontFamily: 'monospace' }}>{result.adnr?.domain || ''} </td>

                                <td className="text-end " style={{ fontFamily: 'monospace' }}>{result.balance} VFX</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        </div>

    );
};
