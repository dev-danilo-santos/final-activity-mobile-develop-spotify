import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ThemeContext from "../../context/context";
import AppTheme from "../themes/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeToogler = () => {
  const [themeMode, setThemeMode] = useContext(ThemeContext);

  useEffect (() => {
    AsyncStorage.setItem('themeMode', themeMode);
  }, [themeMode]) 

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: AppTheme[themeMode].backgroundColor },
      ]}
      onPress={() =>
        setThemeMode(themeMode === "light" ? "dark" : "light")
      }
    >
      <Text style={styles.icon}>
        {themeMode === "light" ? "🌙" : "☀️"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    height: 40,
    width: 70,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
};

export default ThemeToogler;
