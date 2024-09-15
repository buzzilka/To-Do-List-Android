import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'expo-checkbox';

const Item = ({ text, id, isComplete, deleteTask, status, edit }) => {
    const [checked, setChecked] = useState(isComplete);

    useEffect(() => {
        const fetchData = async () => {
            const savedState = await AsyncStorage.getItem(`isComplete-${id}`);
            if (savedState !== null) {
                setChecked(JSON.parse(savedState));
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        AsyncStorage.setItem(`isComplete-${id}`, JSON.stringify(checked));
    }, [checked, id]);

    const handleCheckboxClick = () => {
        setChecked(!checked);
        status(id);
    };

    return (
        <View style={[styles.container, checked ? styles.checked : styles.unchecked]}>
            <TouchableOpacity onPress={handleCheckboxClick} style={styles.checkBoxContainer}>
                <CheckBox style={styles.checkBox} value={checked} onValueChange={handleCheckboxClick} />
                <Text style={[styles.text, checked && styles.lineThrough]}>{text}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(id)}>
                <Text style={styles.icon}>🗑️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => edit(id)}>
                <Text style={styles.icon}>✏️</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 5,
    },
    checked: {
        backgroundColor: '#4CAF50',
    },
    unchecked: {
        backgroundColor: '#f0f0f0',
    },
    checkBoxContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
    },
    lineThrough: {
        textDecorationLine: 'line-through',
    },
    icon: {
        fontSize: 18,
        marginLeft: 10,
    },
    checkBox:{
        color:'#4CAF50'
    }
});

export default Item;
