import {FC, useEffect, useState, ReactNode} from 'react';
import LoadingSpinner from 'react-spinners/HashLoader';

const delay = 2000; //2s
let setTimeoutInstance: NodeJS.Timeout | undefined;

type Props = {
  isLoading: boolean;
  children: ReactNode;
};

const Loader: FC<Props> = ({isLoading, children}) => {
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setIsExpired(false);

      if (setTimeoutInstance) {
        clearTimeout(setTimeoutInstance);
      }
      setTimeoutInstance = setTimeout(() => {
        setIsExpired(true);
      }, delay);
    }
  }, [isLoading]);

  if (!isExpired) {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2">
        <LoadingSpinner color="black" size={70} />
      </div>
    );
  }



  return <>{children}</>;
};

export default Loader;
