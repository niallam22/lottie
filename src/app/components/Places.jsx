import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";

import AsyncSelect from "react-select/async"
  
  export default function Places({ setHome }) {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();
  
    //get lat,lng for selected option and set as home   
    const handleSelect = async (val) => {
      setValue(val, false);
      clearSuggestions();

      const results = await getGeocode({ address: val.value });

      const { lat, lng } = await getLatLng(results[0]);

      setHome({ lat, lng });
    };
    
    //set the user's search param for usePlacesAutocomplete to return options
    const loadOptions = async (searchValue, callback) => {
        setValue(searchValue) 
        
        //format data for react-select element [{label: '', value: ''},...]
        const displayData = data.map(location => ({
            label: location.description ?? '', 
            value: (location.description ?? '').toLowerCase(),
        }));
        callback(displayData)
    }

    return (
        <AsyncSelect
            loadOptions={loadOptions}
            onChange={handleSelect}
            placeholder='Enter postcode or address'
        />
    );
  }