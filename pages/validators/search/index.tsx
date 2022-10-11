import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { ValidatorCardList } from "../../../src/components/validator-card-list";
import { Validator } from "../../../src/models/validator";
import { ValidatorService } from "../../../src/services/validator-service";


const ValidatorSearch: NextPage = () => {

    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [validators, setValidators] = useState<Validator[]>([]);

    const handleSearch = useCallback(async () => {
        const service = new ValidatorService();

        if (query) {
            setLoading(true);
            const data = await service.search(query);

            setValidators(data.results);
            setLoading(false);
        } else {
            setValidators([]);
        }
    }, [query]);

    useEffect(() => {
        const listener = (event: any) => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                handleSearch();
                event.preventDefault();
                // callMyFunction();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [handleSearch]);


    return (
        <>
            <div className="container mt-4">

                <h4 className="text-center">Validator Status Checker</h4>

                <div className="row">

                    <div className="col-md-6 offset-md-3">

                        <div className="form-group">
                            <label htmlFor="">
                                Validator Name or Address
                            </label>

                            <input
                                type="text"
                                className="form-control bg-dark text-light"
                                placeholder={"RBnw8...."}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />

                            <div className="text-end mt-2">
                                <button className="btn btn-primary" onClick={handleSearch}>

                                    Check Status</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div className="text-center">

                {loading ? <div className="spinner-border text-light" role="status">
                </div> : null}
            </div>
            <ValidatorCardList validators={validators} />
        </>

    )
}

export default ValidatorSearch;