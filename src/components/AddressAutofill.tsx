import {FC, ReactElement, useCallback} from 'react';
import {AddressAutofill as MapBoxAddressAutofill} from '@mapbox/search-js-react';
import {AutofillRetrieveResponse} from '@mapbox/search-js-core';
import {GeoJSON} from 'geojson';
import {InputProps} from '@/common/Input';

const accessToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;

type Props = {
  children: ReactElement<InputProps>;
  setGeoLocation: (x: GeoJSON.Feature<GeoJSON.Point>) => void;
};

const AddressAutofill: FC<Props> = ({children, setGeoLocation}) => {
  const handleRetrieve = useCallback(
    (res: AutofillRetrieveResponse) => {
      const geoLocation = res.features[0];
      setGeoLocation(geoLocation as GeoJSON.Feature<GeoJSON.Point>);
    },
    [setGeoLocation]
  );

  return (
    <MapBoxAddressAutofill
      accessToken={accessToken}
      popoverOptions={{
        placement: 'bottom-start',
        flip: false,
        offset: 5,
      }}
      onRetrieve={handleRetrieve}
    >
      {children}
    </MapBoxAddressAutofill>
  );
};

export default AddressAutofill;
