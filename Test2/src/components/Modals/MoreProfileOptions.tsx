import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const MoreProfileOptionsPopup = ({ visible, onClose }) => (
  <Modal visible={visible} transparent >
    <TouchableOpacity style={styles.moreOptionsOverlay} onPress={onClose}>
      <View style={styles.moreOptionsContainer}>
        <TouchableOpacity style={styles.moreOptionsItem}>
          <Text style={styles.moreOptionsText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreOptionsItem}>
          <Text style={styles.moreOptionsText}>Block</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreOptionsItem}>
          <Text style={styles.moreOptionsText}>Report</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  moreOptionsOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  moreOptionsContainer: {
    width: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 200,
  },
  moreOptionsItem: {
    padding: 5,
  },
  moreOptionsText: {
    fontSize: 14,
  },
});

export default MoreProfileOptionsPopup;
