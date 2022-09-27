import { FC } from "react";
import { AddressMinimap as MapBoxAddressMiniMap } from "@mapbox/search-js-react";
const accessToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
import { GeoJSON } from "geojson";




type Props = {
  geoLocation: GeoJSON.Feature<GeoJSON.Point> | undefined
}

const AddressMiniMap: FC<Props> = ({ geoLocation }) => {

  const isLocationPresent = Boolean(geoLocation);


  return (
    <>
      {isLocationPresent &&
        <div>
          <div className="w-full h-64 rounded relative">
            <MapBoxAddressMiniMap
              accessToken={accessToken}
              keepMarkerCentered={true}
              canAdjustMarker={true}
              satelliteToggle={true}
              feature={geoLocation}
              show={true}
              footer={false}
            />
          </div>
          <h2>
            {
              `Adjust the marker on the map if it doesn't
          precisely match your location. This helps improve address data
          quality.`
            }
          </h2>
        </div>
      }
    </>
  );
};

export default AddressMiniMap;