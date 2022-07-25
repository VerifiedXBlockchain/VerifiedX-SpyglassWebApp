import { Block } from "../models/block";
import { Nft } from "../models/nft";
import { Validator } from "../models/validator";
import { BlockCard } from "./block-card";
import { NftCard } from "./nft-card";
import { ValidatorCard } from "./validator-card";

interface Props {
  nfts: Nft[];
}

export const NftCardList = (props: Props) => {
  const { nfts } = props;
  return (
    <div className="container">
      <div className="row">
        {nfts.map((nft) => (
          <div className="col-12 col-md-4 py-2" key={nft.identifier}>
            <NftCard nft={nft} />
          </div>
        ))}
      </div>
    </div>
  );
};
