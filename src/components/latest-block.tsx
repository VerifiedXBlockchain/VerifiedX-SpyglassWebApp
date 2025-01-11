/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState } from "react"
import { Block } from "../models/block";
import { BlockService } from "../services/block-service";
import * as timeago from 'timeago.js';

interface Props {

}

export const LatestBlock = (props: Props) => {
    const [block, setBlock] = useState<Block | undefined>(undefined);



    useEffect(() => {
        const poll = () => {
            const service = new BlockService();
            const params = { limit: 1 };

            service.list(1, params).then((data) => {
                if (data.results.length > 0) {
                    setBlock(data.results[0]);
                }
            })
        }

        poll();

        const interval = setInterval(() => {
            poll();
        }, 5000);

        return () => clearInterval(interval);

    }, [])




    return <div className="bg-black my-4 py-2 px-3 rounded" style={{ boxShadow: "0 0 3px 2px rgba(255,255,255,.15)" }}>
        {block ? (

            <div>
                <div className="d-flex justify-content-between">
                    <div>Block {block.height}</div>
                    <div><small className="text-light">{block.timestampLabel}</small></div>
                </div>
                <div className="pt-2">
                    <LineItem title="Hash" value={block.hash} fullWidth href={"/block/" + block.height}></LineItem>
                </div>

                <div className="d-flex justify-content-between">
                    <LineItem title="Craft Time" value={`${block.craftTime} ms`}></LineItem>
                    <LineItem title="Size" value={block.sizeLabel}></LineItem>
                </div>
                <div className="d-flex justify-content-between">
                    <LineItem title="# of Txs" value={block.transactions.length.toString()}></LineItem>
                    <div className="pt-2" style={{ width: '50%' }}>
                        {block.transactions.map((t, i) => <a key={t.hash} style={{ fontSize: '12px', lineHeight: "10px", textDecoration: "none" }} href={"/transaction/" + t.hash}>View Tx {i + 1}</a>)}
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <LineItem title="Amount" value={`${block.totalAmount} VFX`}></LineItem>
                    <LineItem title="Fee" value={`${block.totalReward} VFX`}></LineItem>

                </div>

                <div className="d-flex justify-content-between">
                    <LineItem title="Validated By" value={block.validator} fullWidth href={'/validators/' + block.validator}></LineItem>
                </div>
            </div>

        ) : (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )}
    </div>
}

interface LineItemProps {
    title: string;
    value: string;
    fullWidth?: boolean;
    href?: string;
}

const LineItem = (props: LineItemProps) => {

    const { title, value, fullWidth, href } = props;

    return (
        <div className="pt-2" style={{ width: fullWidth ? '100%' : '50%' }}><div className="text-light"><small><u>{title}</u></small></div>

            {href ? (<>
                <a style={{ fontSize: '12px', lineHeight: "10px", wordBreak: 'break-all', textDecoration: "none" }} href={href}>{value}</a>
            </>) : (
                <span style={{ fontSize: '12px', lineHeight: "10px", wordBreak: 'break-all' }}>{value}</span>
            )}

        </div>);
}

interface DateCraftedProps {
    date: Date;
}

const DateCrafted = (props: DateCraftedProps) => {

    const { date } = props;

    const [label, setLabel] = useState<String>(timeago.format(date))

    useEffect(() => {

        const update = () => {
            setLabel(timeago.format(date));
        }

        update();
        const interval = setInterval(() => {
            update();
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return <small className="text-light">{label}</small>
}