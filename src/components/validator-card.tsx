import { Validator } from "../models/validator";

interface Props {
  validator: Validator;
}

export const ValidatorCard = (props: Props) => {
  const { validator } = props;

  return (
    <div className="card">
      <div className="card-header  d-flex justify-content-between align-items-center">
        {validator.uniqueName}
        <a
          href={`/validators/${validator.address}`}
          className="btn btn-primary btn-sm"
        >
          View Details
        </a>
      </div>
      <ul className="list-group">
        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>Status</div>
            {validator.isActive ? (
              <div className="badge bg-success">Active</div>
            ) : (
              <div className="badge bg-danger">Inactive</div>
            )}
          </div>
        </li>
        <li className="list-group-item ">
          <div>Address</div>
          <small>{validator.address}</small>
        </li>
        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>IP</div>
            <small>{validator.ipAddress}</small>
          </div>
        </li>
        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>Connection ID</div>
            <small>{validator.connectionId}</small>
          </div>
        </li>

        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>Blocks Crafted</div>
            <small>{validator.blockCount}</small>
          </div>
        </li>
      </ul>
      <div className="card-footer text-muted text-center">
        Connected: {validator.dateLabel}
      </div>
    </div>
  );
};
