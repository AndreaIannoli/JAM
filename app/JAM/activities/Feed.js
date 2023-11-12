import {Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import TopBar from "./TopBar";
import {Colors} from "../res/Colors";
import {getStatusComponent} from "../services/StreetService";
import {useContext, useEffect, useState} from "react";
import {getUserFavourites, getUserNotifications, removeNotification} from "../services/UserService";
import {StreetsInfosContext} from "../components/StreetsInfosProvider";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import Animated, {
    Extrapolate, interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated"
import {GestureHandlerRootView, PanGestureHandler} from "react-native-gesture-handler";
import {useTranslation} from "react-i18next";

function Feed(){
    const [notifications, setNotifications] = useState(new Map());
    const {updateNotifications, setUpdateNotifications} = useContext(StreetsInfosContext);
    const { t } = useTranslation();

    const deviceWidth = Dimensions.get('window').width;
    const threshold = -deviceWidth * 0.4;
    const Item = ({ title, description, notificationType, date, notificationId }) => {
        const dragX = useSharedValue(0);
        const height = useSharedValue(90);
        const opacity = useSharedValue(1);
        const gestureHandler = useAnimatedGestureHandler({
            onActive: (e) => {
                dragX.value = e.translationX;
                const opacityValue = interpolate(e.translationX, [0, -deviceWidth], [1, 0], Extrapolate.CLAMP);
                opacity.value = opacityValue;
            },
            onEnd: (e) => {
                if (threshold < e.translationX) {
                    dragX.value = withTiming(0);
                } else {
                    dragX.value = withTiming(-deviceWidth);
                    height.value = withTiming(0);
                    opacity.value = withTiming(0);
                    runOnJS(removeNotification)(notificationId);
                    runOnJS(setUpdateNotifications)(currentUpdate => currentUpdate + 1);
                }
            }
        });
        const itemContainerStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        translateX: dragX.value,
                    }
                ],
                height: height.value,
                opacity: opacity.value,
                marginTop: opacity.value === 1 ? 10 : 10
            }
        })
        return (
            <PanGestureHandler failOffsetY={[-5, 5]} activeOffsetX={[-5, 5]} onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.notificationRow, itemContainerStyle]}>
                    {getNotificationIcon(notificationType)}
                    <View style={styles.notificationInfos}>
                        <View style={styles.notificationHeadingRow}>
                            <Text style={styles.notificationHeading}>{title}</Text>
                            <Text style={styles.ago}>{timeAgo((date.toDate().getTime()) / 1000)}</Text>
                        </View>
                        <Text style={styles.notificationBody}>{getNotificationDesc(title, description, notificationType)}</Text>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        );
    };

    async function retrieveNotifications() {
        setNotifications(await getUserNotifications());
    }

    useEffect(() => {
        retrieveNotifications();
    }, [updateNotifications]);

    function getNotificationIcon(notificationType) {
        if(notificationType === 'notifyFree') {
            return(
                <View style={styles.notificationIconContainer}>
                    <MaterialCommunityIcons name="car" size={50} color={Colors.green} />
                </View>
            );
        } else if(notificationType === 'notifyAlmostFull') {
            return(
                <View style={styles.notificationIconContainer}>
                    <MaterialCommunityIcons name="car-multiple" size={50} color={Colors.orange} />
                </View>
            );
        } else if(notificationType === 'notifyFull') {
            return(
                <View style={styles.notificationIconContainer}>
                    <MaterialCommunityIcons name="car-multiple" size={50} color={Colors.red} />
                </View>
            );
        }
    }

    function timeAgo(timestamp) {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const timeDifference = currentTimestamp - timestamp;

        if (timeDifference < 5) { // Consider timestamps within 5 seconds as "just now"
            return "just now";
        } else if (timeDifference < 3600) {
            const minutes = Math.floor(timeDifference / 60);
            return `${minutes}m ago`;
        } else if (timeDifference < 86400) {
            const hours = Math.floor(timeDifference / 3600);
            const minutes = Math.floor((timeDifference % 3600) / 60);
            return `${hours}h ${minutes}m ago`;
        } else {
            const days = Math.floor(timeDifference / 86400);
            const hours = Math.floor((timeDifference % 86400) / 3600);
            return `${days}d ago`;
        }
    }

    function getNotificationDesc(title, description, notificationType) {
        if(notificationType === "notifyAlmostFull" || notificationType === "notifyFull" || notificationType === "notifyFree") {
            return t(notificationType.replace("notify", "").toLowerCase() + "StreetNotificationBody", {streetName: title});
        } else {
            return description;
        }
    }

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            alignItems: "center",
            backgroundColor: Colors.surface200,
        },
        notificationRow: {
            display: 'flex',
            flexDirection: "row",
            width: '100%',
            alignItems: "center",
            paddingHorizontal: 10,
            gap: 10,
            backgroundColor: Colors.surface500,
            borderRadius: 25
        },
        notificationIconContainer: {
            width: 70,
            height: 70,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.surface200,
            borderRadius: 15
        },
        notificationHeading: {
            fontSize: 20,
            fontWeight: "bold",
            color: 'white'
        },
        notificationBody: {
            fontSize: 18,
            color: 'white',
            flexWrap: 'wrap',
            flexDirection: "row",
            flexShrink: 1
        },
        notificationInfos: {
            flexGrow: 1,
            maxWidth: "80%"
        },
        notificationsContainer: {
            width: '100%'
        },
        notificationHeadingRow: {
            flexDirection: "row"
        },
        ago: {
            marginLeft: "auto",
            color: "white"
        },
        flatList: {
            paddingBottom: 100,
            paddingHorizontal: 10
        }
    })
    return(
        <View style={styles.container}>
            <TopBar page="Feed"/>
            <View style={styles.notificationsContainer}>
                <GestureHandlerRootView>
                    <FlatList
                        data={Object.keys(notifications).sort((a,b) =>
                            notifications[a]['date'].toDate() - notifications[b]['date'].toDate() > 0 ? -1 : 1
                        )}
                        renderItem={({item}) => <Item title={notifications[item]['title']} description={notifications[item]['description']} notificationType={notifications[item]['notificationType']} date={notifications[item]['date']} notificationId={item}/>}
                        KeyExtractor={({ item }) => item.toString()}
                        style={styles.flatList}
                        persistentScrollbar={true}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 300 }}
                        extraData={updateNotifications}
                    />
                </GestureHandlerRootView>
            </View>
        </View>
    )
}

export default Feed;
