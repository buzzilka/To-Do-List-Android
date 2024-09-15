import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const EditForm = ({ edit, task }) => {
    const [value, setValue] = useState(task.text);

    const handleInputChange = (text) => {
        setValue(text);
    };

    const handleEdit = () => {
        if (value.trim()) {
            edit(task.id, value);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={handleInputChange}
                style={styles.input}
                placeholder="Редактировать задачу..."
            />
            <Button
                onPress={handleEdit}
                title="Сохранить"
                color="#4CAF50"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
});

export default EditForm;
