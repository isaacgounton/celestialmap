import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { Parish } from "../../types/Parish";
import { getParishById } from "../../services/parishService";

type ParishDetailsScreenProps = {
    route: RouteProp<MainStackParamList, "ParishDetails">;
    navigation: FrameNavigationProp<MainStackParamList, "ParishDetails">;
};

export function ParishDetailsScreen({ route }: ParishDetailsScreenProps) {
    const [parish, setParish] = React.useState<Parish | null>(null);
    const { parishId } = route.params;

    React.useEffect(() => {
        getParishById(parishId).then(setParish);
    }, [parishId]);

    if (!parish) {
        return (
            <flexboxLayout style={styles.container}>
                <activityIndicator busy={true} />
            </flexboxLayout>
        );
    }

    return (
        <scrollView>
            <flexboxLayout style={styles.container}>
                <image src={parish.photos[0]} style={styles.headerImage} />
                
                <label className="text-2xl font-bold mt-4">{parish.name}</label>
                <label className="text-gray-600 mt-2">{parish.address}</label>
                
                <stackLayout className="mt-4 w-full">
                    <label className="font-semibold">Parish Leader</label>
                    <label>{parish.leaderName}</label>
                </stackLayout>

                <stackLayout className="mt-4 w-full">
                    <label className="font-semibold">Contact</label>
                    <label>{parish.phone}</label>
                    {parish.website && <label>{parish.website}</label>}
                </stackLayout>

                <stackLayout className="mt-4 w-full">
                    <label className="font-semibold">Opening Hours</label>
                    {Object.entries(parish.openingHours).map(([day, hours]) => (
                        <label key={day}>{`${day}: ${hours}`}</label>
                    ))}
                </stackLayout>

                <button className="bg-blue-500 text-white p-4 rounded-lg mt-6">
                    Adopt this Parish
                </button>
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "column",
        alignItems: "flex-start"
    },
    headerImage: {
        width: "100%",
        height: 200
    }
});