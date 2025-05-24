import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

const CreateActionScreen = () => {
  const [actionTopic, setActionTopic] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#fff" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle action</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.appTitle}>App Design</Text>
        </View>

        {/* Task Topic Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Type here"
            value={actionTopic}
            onChangeText={setActionTopic}
            multiline
          />
        </View>
        {/* Task Topic Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Echéance</Text>
          <View style={styles.assignmentLeft}>
              <View style={styles.calendarIcon}>
                <Icon name="calendar-outline" size={18} color="#fff" />
              </View>
              <View style={styles.assignmentText}>
                <Text style={styles.assignmentLabel}>Echéance</Text>
                <Text style={styles.assignmentValue}>20 mai</Text>
              </View>
            </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Créer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D7CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    marginLeft: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  listHere: {
    color: '#2D7CFF',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
    marginBottom: 30,
  },
  assignmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  assignmentItem: {
    flex: 1,
  },
  assignmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  calendarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2D7CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignmentText: {
    marginLeft: 10,
  },
  assignmentLabel: {
    fontSize: 14,
    color: '#666',
  },
  assignmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    height: 200,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#2D7CFF',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateActionScreen;
