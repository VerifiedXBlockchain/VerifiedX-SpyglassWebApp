import { VbtcToken } from "../models/vbtc-token";


interface Props {
    tokens: VbtcToken[];
}

export const VbtcTokenList = (props: Props) => {
    const { tokens } = props;


    return (
        <>
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Smart Contract</th>
                        <th>Owner</th>
                        <th>Minted At</th>
                        <th style={{ textAlign: 'right' }}>Global Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.filter((t) => t.global_balance > 0).map((token) => (
                        <tr key={token.sc_identifier} style={{ verticalAlign: 'middle' }}>
                            <td>
                                <a href={`/vbtc-token/${token.sc_identifier}`}>
                                    <img src={token.image_url} alt={token.name} width={48} height={48} style={{ borderRadius: 24 }} />
                                </a>
                            </td>
                            <td>
                                <a href={`/vbtc-token/${token.sc_identifier}`}>

                                    {token.name}
                                </a>
                            </td>
                            <td>
                                {token.nft.identifier}

                            </td>
                            <td>
                                <a href={`/search?q=${token.owner_address}`}>{token.owner_address}</a>
                            </td>
                            <td>{token.created_at ? token.created_at.toLocaleDateString() : '-'}</td>
                            <td style={{ textAlign: 'right' }}>{token.global_balance} vBTC</td>
                        </tr>
                    ))}
                </tbody>
            </table >
        </>
    )
}