import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { getUserProfile } from "../../services/userService";
import { User } from "../../types/User";

type ProfileScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Profile">;
};

export function ProfileScreen({ navigation }: ProfileScreenProps) {
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        getUserProfile().then(setUser);
    }, []);

    if (!user) {
        return (
            <flexboxLayout style={styles.container}>
                <activityIndicator busy={true} />
            </flexboxLayout>
        );
    }

    return (
        <scrollView>
            <flexboxLayout style={styles.container}>
                <image src={user.avatar} className="w-24 h-24 rounded-full mb-4" />
                <label className="text-2xl font-bold mb-2">{user.name}</label>
                <label className="text-gray-600 mb-6">{user.email}</label>

                <stackLayout className="w-full">
                    <button className="bg-blue-500 text-white p-4 rounded-lg mb-4">
                        My Adopted Parishes
                    </button>
                    <button className="bg-green-500 text-white p-4 rounded-lg mb-4">
                        My Orders
                    </button>
                    <button className="bg-purple-500 text-white p-4 rounded-lg mb-4">
                        Settings
                    </button>
                    <button className="bg-red-500 text-white p-4 rounded-lg">
                        Sign Out
                    </button>
                </stackLayout>
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "column",
        alignItems: "center"
    }
});