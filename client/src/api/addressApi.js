// src/api/addressApi.js
import api from "./axios";

/* =======================================================
   ✅ COUNTRIES
======================================================= */
export const getCountries = async () => {
  const res = await api.get("/address/countries");
  return res.data;
};

/* =======================================================
   ✅ STATES by countryId
======================================================= */
export const getStates = async (countryId) => {
  const res = await api.get(`/address/states/${countryId}`);
  return res.data;
};

/* =======================================================
   ✅ CITIES by stateId
======================================================= */
export const getCities = async (stateId) => {
  const res = await api.get(`/address/cities/${stateId}`);
  return res.data;
};



// export const getAllCitiesFromSearch = async (searchText = "") => {
//   const res = await api.get("/address/cities/search", {
//     params: { searchText },
//   });
//   return res.data;
// };

export const getAllCitiesFromSearch = async (searchText = "") => {
  const res = await api.get("/address/cities/all", {
    params: { searchText },
  });
  return res.data;
};
/* ✅ NEW: SEARCH BASED CITY DROPDOWN */
// export const searchCities = async (searchText) => {
//   const res = await api.get("/address/cities/search", {
//     params: { searchText },
//   });
//   return res.data;
// };