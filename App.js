import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, FlatList } from "react-native";

import { getKommunes } from "./api";
import ListFilter from "./List/ListFilter";

function App() {
  const [filteredKommunes, setFilteredKommunes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [komunes, setKommunes] = useState([]);

  useEffect(() => {
    async function fetchKommunes() {
      try {
        const kommunes = await getKommunes();
        setKommunes(kommunes);
        setFilteredKommunes(kommunes);
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
        setIsLoaded(false);
      }
    }

    fetchKommunes();
  }, []);

  function handleFilterChanged(keyword, filterType) {
    const matcher = makeMatcher(keyword, filterType);
    setFilteredKommunes(komunes.filter(matcher));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ListFilter
        placeholder="Type search keyword here"
        onFilterChanged={handleFilterChanged}
        defaultFilter={DEFAULT_FILTER_TYPE}
        filters={FILTERS}
      />
      {isLoaded ? (
        <FlatList
          data={filteredKommunes.map((kommune) => ({
            key: kommune.label,
            ...kommune,
          }))}
          renderItem={({ item }) => (
            <Text>
              {item.label} : {item.description} : {item.status}
            </Text>
          )}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

/**
 * Factory function to make different match
 *
 * @param {string} match
 * @param {FilterType} type
 * @returns {Function} (k: IKommune) => boolean
 */
const makeMatcher = (match, type) => (k) => {
  return k[type].toLowerCase().indexOf(match.trim().toLowerCase()) !== -1;
};

const DEFAULT_FILTER_TYPE = "description";
const FILTERS = [
  { type: "description", text: "Description" },
  { type: "label", text: "Label" },
  { type: "status", text: "Status" },
];

export default App;
