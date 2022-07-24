/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CirculationService } from "../../src/services/circulation-service";


const CirculationPage: NextPage = () => {
  const router = useRouter();
  const { hash } = router.query;

  const [circulation, setCirculation] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {


    const service = new CirculationService();

    service.retrieve().then((data) => {
      console.log(data);
      setCirculation(data);
    });
  }, []);

  if (!circulation) return <></>;

  return (
    <div>
      <div className="container">
      <div className="alert bg-success text-center mt-4">
            Circulation: {circulation} RBX
          </div>
      </div>
    </div>
  );
};

export default CirculationPage;
