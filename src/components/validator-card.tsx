import { Validator } from "../models/validator";

interface Props {
  validator: Validator;
}

export const ValidatorCard = (props: Props) => {
  const { validator } = props;

  return (
    <div className="card">
      <div className="card-header  d-flex justify-content-between align-items-center">
        <span
          style={{
            // wordBreak: "break-all",
            whiteSpace: "pre-line",
            overflowWrap: "anywhere",
          }}
        >
          {validator.uniqueName}
        </span>
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
          <small
            style={{
              // wordBreak: "break-all",
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}
          >
            {validator.address}
          </small>
        </li>

        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>Location</div>
            <small>{validator.location ? validator.location.label : "-"}</small>
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
