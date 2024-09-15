import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Item from './Item';
import EditForm from './EditForm';

const ToDo = () => {
    const [toDoList, setToDoList] = useState([]);
    const [inputText, setInputText] = useState(''); 

    useEffect(() => {
        const fetchData = async () => {
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks) {
                setToDoList(JSON.parse(storedTasks));
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('tasks', JSON.stringify(toDoList));
    }, [toDoList]);

    const addTask = () => {
        if (inputText.trim() === "") {
            return;
        }

        const newTask = {
            id: Date.now(),
            text: inputText,
            isComplete: false,
            isEditing: false,
        };

        setToDoList((prev) => [...prev, newTask]);
        setInputText(''); 
    };

    const deleteTask = (id) => {
        setToDoList((prev) => prev.filter((task) => task.id !== id));
    };

    const status = (id) => {
        setToDoList((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, isComplete: !task.isComplete } : task
            )
        );
    };

    const edit = (id) => {
        setToDoList((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, isEditing: !task.isEditing } : task
            )
        );
    };

    const editTask = (id, newText) => {
        setToDoList((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, text: newText, isEditing: false } : task
            )
        );
    };

    const saveToFile = async () => {
        try {
            const fileUri = FileSystem.documentDirectory + 'todo-list.json';
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(toDoList));
            alert('Список задач сохранен!');
        } catch (error) {
            console.error('Ошибка при сохранении файла:', error);
        }
    };

    const loadFromFile = async () => {
        try {
            const fileUri = FileSystem.documentDirectory + 'todo-list.json';
            const fileContent = await FileSystem.readAsStringAsync(fileUri);
            if (fileContent) {
                setToDoList(JSON.parse(fileContent));
            } else {
                alert('Файл не найден.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>To-Do List</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    value={inputText} 
                    onChangeText={setInputText}
                    style={styles.input}
                    placeholder="Что мне нужно сделать..."
                />
                <Button title="Добавить +" onPress={addTask} color="#4CAF50" />
            </View>
            <ScrollView style={styles.scrollView}>
                {toDoList.map((task) =>
                    task.isEditing ? (
                        <EditForm key={task.id} edit={editTask} task={task} />
                    ) : (
                        <Item
                            key={task.id}
                            text={task.text}
                            id={task.id}
                            isComplete={task.isComplete}
                            deleteTask={deleteTask}
                            status={status}
                            edit={edit}
                        />
                    )
                )}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
                <Button title="Сохранить в файл" onPress={saveToFile} color="#4CAF50" />
                <Button title="Загрузить из файла" onPress={loadFromFile} color="#4CAF50" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header:{
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 30
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    scrollView: {
        marginTop: 10,
    },
});

export default ToDo;
