import { useState } from "react";
import { Block } from "../models/block";
import { Validator } from "../models/validator";
import { BlockCard } from "./block-card";
import ValidatorFilterBar from "./validator-filtering";
import { ValidatorRow } from "./validator-row";

interface Props {
  validators: Validator[];
}

export const ValidatorList = (props: Props) => {
  const { validators } = props;

  const [sorting, setSorting] = useState<"uniqueName" | "address" | "locationLabel" | undefined>(undefined);
  const [sortingDirection, setSortingDirection] = useState(false);

  const updateSorting = (col: "uniqueName" | "address" | "locationLabel") => {
    if (sorting == col) {
      setSortingDirection(!sortingDirection);
    } else {
      setSortingDirection(false);
    }

    setSorting(col);
  }


  let sortedValidators = [...validators];

  if (sorting) {
    sortedValidators = [...validators].sort((a, b) => a[sorting] > b[sorting] ? sortingDirection ? 0 : 1 : sortingDirection ? 1 : 0)
  }


  return (
    <>
      {/* <ValidatorFilterBar /> */}
      <table className="table table-sm ">
        <thead>
          <tr>
            <th>Status</th>
            <th style={{ cursor: 'pointer' }} onClick={() => updateSorting('address')}>
              Address{' '}
              <span className={sorting == 'address' ? '' : 'text-muted'}><i className={`bi ${sorting == 'address' && sortingDirection ? 'bi-sort-alpha-up' : 'bi-sort-alpha-down'} `}></i></span>
            </th>

            <th style={{ cursor: 'pointer' }} onClick={() => updateSorting('uniqueName')}>
              Validator Name{' '}
              <span className={sorting == 'uniqueName' ? '' : 'text-muted'}><i className={`bi ${sorting == 'uniqueName' && sortingDirection ? 'bi-sort-alpha-up' : 'bi-sort-alpha-down'} `}></i></span>
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => updateSorting('locationLabel')}>
              Location{' '}
              <span className={sorting == 'locationLabel' ? '' : 'text-muted'}><i className={`bi ${sorting == 'locationLabel' && sortingDirection ? 'bi-sort-alpha-up' : 'bi-sort-alpha-down'} `}></i></span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedValidators.map((v) => (
            <ValidatorRow key={v.address} validator={v}></ValidatorRow>
          ))}
        </tbody>
      </table>
    </>

  );
};
