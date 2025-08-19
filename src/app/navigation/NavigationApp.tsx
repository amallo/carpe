import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ionicons';


import App from '../components/App';
import CreateActionScreen from '../components/CreateActionScreen';
import { Profile } from '../components/Profile';
import React from 'react';
import { HeaderProfile } from '../components/HeaderProfile';

const Tab = createBottomTabNavigator();


// Move icon components outside
const TalkIcon = ({focused}: {focused: boolean}) => (
  <Icon name="mail" size={24} color={focused ? '#03A9F4' : '#888'}  />
);

const AddIcon = ({focused}: {focused: boolean}) => (
    <Icon name="map" size={30} color={focused ? '#03A9F4' : '#888'} />
);

const SettingsIcon = ({focused}: {focused: boolean}) => (
  <Icon name="person" size={24} color={focused ? '#03A9F4' : '#888'} />
);


export const NavigationApp = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'white',
            margin: 8,
          },
          tabBarShowLabel: true,
        }}
      >
        <Tab.Screen
          name="Discuter"
          component={App}
          options={{
            tabBarIcon: TalkIcon,

          }}
        />
        <Tab.Screen
          name="Explorer"
          component={CreateActionScreen}
          options={{
            tabBarIcon: AddIcon,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}

          options={{
            tabBarIcon: SettingsIcon,
            header : () => <HeaderProfile />,
          }}
        />
      </Tab.Navigator>
    );
};

