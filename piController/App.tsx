/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import sensor, { accelerometer,SensorData } from "react-native-sensors";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import SensorView from './SensorView';
import {map,merge,scan} from 'rxjs';
type SensorValues = 
{accelerometer: {x: number, y: number, z: number};
gyroscope: {x: number, y: number, z: number};
magnetometer: {x: number, y: number, z: number};
barometer: {pressure: number}}

const accel$ = sensor.accelerometer.pipe(map((sensorValue:SensorData) => ({accelerometer:sensorValue})))
const gyro$ = sensor.gyroscope.pipe(map((sensorValue:SensorData) => ({gyroscope:sensorValue})))
const magnetometer$ = sensor.magnetometer.pipe(map((sensorValue:SensorData) => ({magnetometer:sensorValue})))
const barometer$ = sensor.barometer.pipe(map((sensorValue) => ({barometer:sensorValue})))

const sensors$ = merge(accel$,gyro$,magnetometer$,barometer$).subscribe(x=>sendData("http://10.0.2.2:5000/",x))

function sendData(url:string,data:any){
  fetch(url,{
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  
}
function App(): JSX.Element {
  const axis = ["x", "y", "z"];

  const availableSensors = {
    accelerometer: axis,
    gyroscope: axis,
    magnetometer: axis,
    barometer: ["pressure"],
  };

  return (
    <ScrollView>

      {Object.entries(availableSensors).map(([name, values]) => (
        <SensorView key={name} sensorName={name} values={values} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
