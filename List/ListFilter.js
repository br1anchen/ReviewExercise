import React, { useState } from "react";

import { Text, TextInput, View, Button } from "react-native";

/**
 * Filter interface.
 * @typedef {Object} IFilter<T>
 * @property {T} type - Filter type.
 * @property {string} text - Filter display text.
 */

/**
 * ListFilter<T> component to control keyword search and filter types
 *
 * @param {string} [placeholder] - Optional placeholder text.
 * @param {Function} onFilterChanged - onFilterChanged callback.
 * @param {T} defaultFilter - default filter value.
 * @param {IFilter<T>[]} filters - filters.
 */

function ListFilter({ placeholder, onFilterChanged, defaultFilter, filters }) {
  const [keyword, setKeyword] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  function handleKeywordChanged(evt) {
    setKeyword(evt.nativeEvent.text);
    onFilterChanged(evt.nativeEvent.text, selectedFilter);
  }

  function handleFilterSelected(type) {
    setSelectedFilter(type);
    onFilterChanged(keyword, type);
  }

  return (
    <View>
      <Text>Filter</Text>
      <TextInput
        style={{ height: 40 }}
        value={keyword}
        placeholder={placeholder}
        onChange={handleKeywordChanged}
      />
      {filters.map((filter, index) => (
        <Button
          key={index}
          title={filter.text}
          color={filter.type === selectedFilter ? "red" : "black"}
          onPress={() => {
            handleFilterSelected(filter.type);
          }}
        />
      ))}
    </View>
  );
}

export default ListFilter;
