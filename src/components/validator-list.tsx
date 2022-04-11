import { Block } from "../models/block";
import { Validator } from "../models/validator";
import { BlockCard } from "./block-card";
import { ValidatorRow } from "./validator-row";

interface Props {
  validators: Validator[];
}

export const ValidatorList = (props: Props) => {
  const { validators } = props;
  return (
    <table className="table table-sm ">
      <thead>
        <tr>
          <th>Status</th>
          <th>Address</th>
          <th>Validator Name</th>
          <th>IP</th>
          <th>Connection ID</th>
          <th>Connected</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {validators.map((v) => (
          <ValidatorRow key={v.address} validator={v}></ValidatorRow>
        ))}
      </tbody>
    </table>
  );
};
