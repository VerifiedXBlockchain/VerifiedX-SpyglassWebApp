import { useState } from "react";


interface Props {
    totalValidators: number;
}

const BlockRewardsCalculator = (props: Props) => {

    const [validatorCount, setValidatorCount] = useState(1);
    const [totalValidators, setTotalValidators] = useState(props.totalValidators);
    const [days, setDays] = useState(1);


    const handleChange = (value: string) => {
        let result = parseInt(value.replace(/\D/g, ''));

        if (result !== undefined) {
            setValidatorCount(result);
        }

    }

    const handleTotalChange = (value: string) => {
        let result = parseInt(value.replace(/\D/g, ''));

        if (result !== undefined) {
            setTotalValidators(result);
        }

    }

    const blocksPerDay = 3456;
    const rewardEstimate = (validatorCount * ((blocksPerDay * days) / totalValidators) * 32) || '';

    return (

        <div className="card">

            <div className="card-body">

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon3">Your Validators (v)</span>
                    </div>
                    <input type="number" value={validatorCount} onChange={(e) => handleChange(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon3">Total Validators (t)</span>
                    </div>
                    <input type="number" value={totalValidators} onChange={(e) => handleTotalChange(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon3">Per (d)</span>
                    </div>
                    <select className="form-control bg-dark text-light"
                        value={days}
                        onChange={(e) => {
                            setDays(parseInt(e.target.value));
                        }}>
                        <option value="1">Day</option>
                        <option value="7">Week</option>
                        <option value="31">Month</option>
                        <option value="365">Year</option>
                    </select>
                </div>

                {rewardEstimate ?
                    <div>

                        <div className="d-flex justify-content-end align-items-center justify-content-md-between">
                            <div className="text-muted d-none d-md-block" >
                                <div><pre className="mb-0">rbx = v * (({blocksPerDay} * d) / t) * 32</pre></div>
                                <div><pre className="mb-0">    = {validatorCount} * (({blocksPerDay} * {days}) / {totalValidators}) * 32</pre></div>
                            </div>

                            <div>
                                <span className="d-none d-md-inline">={' '}</span>

                                <div className="badge badge-lg bg-success">
                                    {rewardEstimate} RBX
                                </div>
                            </div>
                        </div>

                        <div className='mt-2 text-muted'><small>This is just an estimate and rewards are not guaranteed.</small></div>
                    </div>
                    : null}
            </div>
        </div>

    )
}


export default BlockRewardsCalculator;