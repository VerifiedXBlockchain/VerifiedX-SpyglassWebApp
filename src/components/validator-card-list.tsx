import { Block } from "../models/block";
import { Validator } from "../models/validator";
import { BlockCard } from "./block-card";
import { ValidatorCard } from "./validator-card";

interface Props {
  validators: Validator[];
}

export const ValidatorCardList = (props: Props) => {
  const { validators } = props;
  return (
    <div className="container">
      <div className="row">
        {validators.map((validator) => (
          <div className="col-12 col-md-4 py-2" key={validator.address}>
            <ValidatorCard validator={validator} />
          </div>
        ))}
      </div>
    </div>
  );
};
