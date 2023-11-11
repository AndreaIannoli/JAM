import React, { useState, useEffect } from 'react';
import {Button, Image, View, Platform, StyleSheet, TouchableOpacity, Text} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Colors} from "../res/Colors";

export default function ImagePickerBox({image, setImage}) {

    const styles = StyleSheet.create({
        imagePickerContainer: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
        },
        imagePickerButton: {
            backgroundColor: Colors.surface200,
            borderRadius: 50,
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center"
        },
        imagePickerText: {
            color: Colors.grey,
            textAlign: "center"
        },
        imagePickerImg: {
            borderRadius: 50,
            width: 100,
            height: 100,
        }
    })

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.imagePickerContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                {image ?
                    <Image source={{ uri: image }} style={styles.imagePickerImg} />
                    :
                    <Text style={styles.imagePickerText}>Immagine profilo</Text>
                }
            </TouchableOpacity>
        </View>
    );
}
