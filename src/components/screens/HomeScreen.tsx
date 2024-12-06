import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";

type HomeScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Home">;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
    return (
        <scrollView>
            <flexboxLayout style={styles.container}>
                <label className="text-3xl font-bold text-center mb-4">
                    Welcome to CelestialMap
                </label>
                
                <button
                    className="bg-blue-500 text-white p-4 rounded-lg mb-4"
                    onTap={() => navigation.navigate("ParishMap")}
                >
                    Find Nearby Parishes
                </button>

                <button
                    className="bg-green-500 text-white p-4 rounded-lg mb-4"
                    onTap={() => navigation.navigate("Marketplace")}
                >
                    Visit Marketplace
                </button>

                <button
                    className="bg-purple-500 text-white p-4 rounded-lg mb-4"
                    onTap={() => navigation.navigate("Profile")}
                >
                    My Profile
                </button>

                <gridLayout rows="auto" columns="*,*" className="w-full">
                    <label row="0" col="0" className="text-lg font-semibold p-2">
                        Featured Parishes
                    </label>
                    <label row="0" col="1" className="text-blue-500 text-right p-2">
                        See All
                    </label>
                </gridLayout>

                <scrollView orientation="horizontal" className="w-full">
                    <stackLayout orientation="horizontal" className="p-2">
                        {/* Featured parishes will be populated here */}
                        <label className="p-4 bg-gray-100 rounded-lg mx-2">
                            Coming Soon
                        </label>
                    </stackLayout>
                </scrollView>
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: 20,
        flexDirection: "column",
        justifyContent: "flex-start",
    }
});