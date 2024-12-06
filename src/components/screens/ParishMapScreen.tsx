import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { MapView, Marker } from "@nativescript/google-maps";
import { getCurrentLocation } from "../../utils/location";
import { Parish } from "../../types/Parish";
import { ParishCard } from "../ui/ParishCard";

type ParishMapScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "ParishMap">;
};

export function ParishMapScreen({ navigation }: ParishMapScreenProps) {
    const [currentLocation, setCurrentLocation] = React.useState({ latitude: 0, longitude: 0 });
    const [selectedParish, setSelectedParish] = React.useState<Parish | null>(null);

    React.useEffect(() => {
        getCurrentLocation().then(location => {
            setCurrentLocation(location);
        });
    }, []);

    return (
        <gridLayout rows="*, auto">
            <MapView
                row={0}
                zoom={15}
                latitude={currentLocation.latitude}
                longitude={currentLocation.longitude}
            />
            {selectedParish && (
                <ParishCard
                    row={1}
                    parish={selectedParish}
                    onTap={() => navigation.navigate("ParishDetails", { parishId: selectedParish.id })}
                />
            )}
        </gridLayout>
    );
}

const styles = StyleSheet.create({
    map: {
        height: "100%",
        width: "100%"
    }
});