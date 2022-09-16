import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  Button,
} from "react-native";

import { getKommunes } from "./api";

function App() {
  const [filteredKommunes, setFilteredKommunes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [komunes, setKommunes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER_TYPE);

  function handleKeywordChanged(evt) {
    setKeyword(evt.nativeEvent.text);
    handleFilterChanged(evt.nativeEvent.text, selectedFilter);
  }

  function handleFilterSelected(type) {
    setSelectedFilter(type);
    handleFilterChanged(keyword, type);
  }

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
      <TextInput
        style={{ height: 40 }}
        value={keyword}
        placeholder={"Type search keyword here"}
        onChange={handleKeywordChanged}
      />
      {FILTERS.map((filter, index) => (
        <Button
          key={index}
          title={filter.text}
          color={filter.type === selectedFilter ? "red" : "black"}
          onPress={() => {
            handleFilterSelected(filter.type);
          }}
        />
      ))}
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
