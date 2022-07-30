import { FC, useEffect, useState } from "react";
import Loader from "react-spinners/ClimbingBoxLoader";

type Props = {
  isLoading: boolean
}

const LoadingIndicator: FC<Props> = ({ isLoading }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(isLoading);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <Loader size={40} loading={loading} />
    </div>
  );
};

export default LoadingIndicator;