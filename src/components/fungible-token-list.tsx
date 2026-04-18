import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FungibleToken } from "../models/fungible-token";


interface Props {
    tokens: FungibleToken[];
}

export const FungibleTokenList = (props: Props) => {
    const { t } = useTranslation("fungibleToken");
    const router = useRouter();
    const { tokens } = props;


    return (
        <>
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th></th>
                        <th>{t("list.table.ticker")}</th>
                        <th>{t("list.table.name")}</th>
                        <th>{t("list.table.smartContract")}</th>
                        <th>{t("list.table.owner")}</th>
                        <th>{t("list.table.deployedAt")}</th>
                        <th style={{ textAlign: 'right' }}>{t("list.table.circulatingSupply")}</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token) => (
                        <tr key={token.sc_identifier} style={{ verticalAlign: 'middle' }}>
                            <td>
                                <a href={`/fungible-token/${token.sc_identifier}`}>
                                    {token.nsfw ? <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#222222" }}></div> : <img src={token.image_url} alt={token.name} width={48} height={48} style={{ borderRadius: 24 }} />}

                                </a>
                            </td>
                            <td>
                                <a href={`/fungible-token/${token.sc_identifier}`}>

                                    {token.ticker}
                                </a>
                            </td>
                            <td>
                                <a href={`/fungible-token/${token.sc_identifier}`}>

                                    {token.name}
                                </a>
                            </td>
                            <td>
                                {token.sc_identifier}

                            </td>
                            <td>
                                <a href={`/search?q=${token.owner_address}`}>{token.owner_address}</a>
                            </td>
                            <td>{token.created_at ? token.created_at.toLocaleDateString(router.locale) : '-'}</td>
                            <td style={{ textAlign: 'right' }}>{token.circulating_supply} {token.ticker}</td>
                        </tr>
                    ))}
                </tbody>
            </table >
        </>
    )
}
