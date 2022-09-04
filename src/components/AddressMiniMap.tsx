import { FC } from "react";
import { AddressMinimap as MapBoxAddressMiniMap } from "@mapbox/search-js-react";
import { MapIcon } from "@heroicons/react/outline";

const accessToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
import { GeoJSON } from "geojson";


const feature: GeoJSON.Feature<GeoJSON.Point> = {
  "geometry": {
    "type": "Point",
    "coordinates": [
      -76.9750541388,
      38.8410857803
    ]
  },
  "type": "Feature",
  "properties": {
    "description": "Southern Ave",
    "marker-symbol": "rail-metro",
    "title": "Southern Ave",
    "url": "http://www.wmata.com/rider_tools/pids/showpid.cfm?station_id=107",
    "lines": [
      "Green"
    ],
    "address": "1411 Southern Avenue, Temple Hills, MD 20748"
  }
};

type Props = {
  geoLocation: GeoJSON.Feature<GeoJSON.Point> | undefined
}

const AddressMiniMap: FC<Props> = ({ geoLocation }) => {

  const isLocationPresent = Boolean(geoLocation);

  return (
    <>
      {isLocationPresent ?
        <div>
          <div className="w-full h-96 rounded relative">
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
        </div> :
        <div className="relative w-full h-96 border-4 border-black rounded flex items-center justify-center">
          <div className="w-1/4">
            <MapIcon />
          </div>
        </div>
      }
    </>
  );
};

export default AddressMiniMap;