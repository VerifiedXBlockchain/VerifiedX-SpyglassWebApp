import { Validator } from "../models/validator";

interface Props {
  validator: Validator;
}

export const ValidatorRow = (props: Props) => {
  const { validator } = props;

  return (
    <tr>
      <td>
        {validator.isActive ? (
          <div className="badge bg-success">Active</div>
        ) : (
          <div className="badge bg-danger">Inactive</div>
        )}
      </td>
      <td>
        <div className="badge badge-lg ps-0">{validator.address}</div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{validator.uniqueNameLabel}</div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{validator.blockCount}</div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{validator.ipAddress}</div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{validator.connectionId}</div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{validator.dateLabel}</div>
      </td>
      <td>
        <a
          href={`/validators/${validator.address}`}
          className="btn btn-primary btn-sm"
        >
          View Details
        </a>
      </td>
    </tr>
  );
};
