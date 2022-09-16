/**
 * Returned Kommune object interface.
 * @typedef {Object} IKommune
 * @property {string} description - Name of the kommune.
 * @property {string} label - Id of the kommune.
 * @property {string} status - Status of the kommune information.
 */


/**
 * Returned Response interface.
 * @typedef {Object} IKommuneResponse
 * @property {IKommune[]} containeditems - Contains all kommune information.
 */

/**
 * API to fetch kommune from server
 *
 * @returns Promise<IKommune[]>
 */
export const getKommunes = async () => {
  const response = await fetch(
    "https://register.geonorge.no/api/subregister/sosi-kodelister/kartverket/kommunenummer-alle.json"
  );
  const result = await response.json();
  return result.containeditems;
};
